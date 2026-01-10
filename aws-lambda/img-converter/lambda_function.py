import json
import os
import io
import boto3
import psycopg2
from PIL import Image, ImageOps

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

SIZES = [256, 512, 768, 1024, 1536]
IMAGE_BUCKET = os.environ.get("IMAGE_BUCKET")
DYNAMODB_TABLE = os.environ.get("DYNAMODB_TABLE")
AWS_CDN_DOMAIN = os.environ.get("AWS_CDN_DOMAIN")
DATABASE_URL = os.environ.get("DATABASE_URL")


def format_size(size_bytes: int) -> str:
    """Format bytes to human readable string"""
    if size_bytes < 1024:
        return f"{size_bytes}B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f}KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f}MB"


def update_usage_metric(user_id: str, total_size_bytes: int):
    """Update or create UsageMetric for the user in PostgreSQL (stores bytes)"""
    if not DATABASE_URL:
        print("DATABASE_URL not set, skipping usage metric update")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Check if usage metric exists for user
        cursor.execute(
            'SELECT id, "totalStorageUsed" FROM "UsageMetric" WHERE "userId" = %s',
            (user_id,),
        )
        existing = cursor.fetchone()

        if existing:
            # Update existing record by adding to total storage
            new_total = existing[1] + total_size_bytes
            cursor.execute(
                """UPDATE "UsageMetric" 
                   SET "totalStorageUsed" = %s, "updatedAt" = NOW() 
                   WHERE "userId" = %s""",
                (new_total, user_id),
            )
            print(
                f"Updated usage metric for user {user_id}: {format_size(new_total)} total"
            )
        else:
            # Create new record
            import uuid

            metric_id = str(uuid.uuid4())[:25]  # cuid-like id
            cursor.execute(
                """INSERT INTO "UsageMetric" (id, "userId", "totalStorageUsed", "createdAt", "updatedAt")
                   VALUES (%s, %s, %s, NOW(), NOW())""",
                (metric_id, user_id, total_size_bytes),
            )
            print(
                f"Created usage metric for user {user_id}: {format_size(total_size_bytes)}"
            )

        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error updating usage metric: {e}")


def lambda_handler(event, context):
    print(event)
    tmpImageLocation = event["Records"][0]["dynamodb"]["NewImage"]["tmpImgLocation"][
        "S"
    ]
    userId = event["Records"][0]["dynamodb"]["NewImage"]["userId"]["S"]
    imageId = event["Records"][0]["dynamodb"]["NewImage"]["imageId"]["S"]

    converted_image_urls, total_size_bytes = process_image(tmpImageLocation)

    update_dynamodb(
        userId,
        imageId,
        tmpImageLocation,
        converted_image_urls,
    )

    # Update usage metrics in PostgreSQL
    update_usage_metric(userId, total_size_bytes)

    return {"statusCode": 200, "body": json.dumps("Image processing complete")}


def update_dynamodb(
    user_id: str, image_id: str, tmp_img_location: str, converted_image_urls: list
):
    """Update DynamoDB with the converted image URLs"""
    table = dynamodb.Table(DYNAMODB_TABLE)

    table.put_item(
        Item={
            "userid-imageid": f"{user_id}-{image_id}",
            "userId": user_id,
            "imageId": image_id,
            "tmpImgLocation": tmp_img_location,
            "convertedImageUrls": converted_image_urls,
        }
    )
    print(f"Updated DynamoDB for user {user_id}, image {image_id}")


def process_image(key: str) -> tuple[list, int]:
    """Process image and return list of converted image URLs and total size in bytes"""
    converted_image_urls = []
    total_size_bytes = 0

    response = s3.get_object(Bucket=IMAGE_BUCKET, Key=key)
    input_bytes = response["Body"].read()
    original_size = len(input_bytes)

    with Image.open(io.BytesIO(input_bytes)) as img:
        img = ImageOps.exif_transpose(img)

        # Detect alpha channel
        has_alpha = img.mode in ("RGBA", "LA") or (
            img.mode == "P" and "transparency" in img.info
        )

        # Convert only if necessary
        if not has_alpha:
            img = img.convert("RGB")

        width, height = img.size
        max_original = max(width, height)

        sizes = [s for s in SIZES if s <= max_original]
        if not sizes:
            sizes = [max_original]

        base, ext = os.path.splitext(os.path.basename(key))
        directory = os.path.dirname(key)

        output_directory = directory.replace("instantuploads", "userimages", 1)

        # Copy original file unchanged
        original_output_key = f"{output_directory}/{base}/original{ext}"
        s3.put_object(
            Bucket=IMAGE_BUCKET,
            Key=original_output_key,
            Body=input_bytes,
            ContentType=response.get("ContentType", "application/octet-stream"),
            CacheControl="public, max-age=31536000, immutable",
        )
        total_size_bytes += original_size

        original_url = f"{AWS_CDN_DOMAIN}/{original_output_key}"
        converted_image_urls.append(
            {
                "resolution": f"{width}x{height}",
                "size": original_size,
                "url": original_url,
            }
        )

        for size in sizes:
            resized = img.copy()
            resized.thumbnail((size, size), Image.Resampling.LANCZOS)

            resized_width, resized_height = resized.size

            buffer = io.BytesIO()

            if has_alpha:
                # Preserve transparency → PNG
                resized.save(
                    buffer,
                    format="PNG",
                    optimize=True,
                )
                content_type = "image/png"
                output_ext = "png"
            else:
                # Opaque → JPEG
                resized.save(
                    buffer,
                    format="JPEG",
                    quality=82,
                    optimize=True,
                    progressive=True,
                )
                content_type = "image/jpeg"
                output_ext = "jpg"

            buffer.seek(0)
            file_size = buffer.getbuffer().nbytes

            output_key = f"{output_directory}/{base}/{size}.{output_ext}"

            s3.put_object(
                Bucket=IMAGE_BUCKET,
                Key=output_key,
                Body=buffer,
                ContentType=content_type,
                CacheControl="public, max-age=31536000, immutable",
            )
            total_size_bytes += file_size

            url = f"{AWS_CDN_DOMAIN}/{output_key}"
            converted_image_urls.append(
                {
                    "resolution": f"{resized_width}x{resized_height}",
                    "size": file_size,
                    "url": url,
                }
            )

            print(
                f"Uploaded {output_key} - {resized_width}x{resized_height}, {format_size(file_size)}"
            )

    s3.delete_object(Bucket=IMAGE_BUCKET, Key=key)
    print(f"Deleted original image from {key}")
    print(f"Total size of processed images: {format_size(total_size_bytes)}")

    return converted_image_urls, total_size_bytes
