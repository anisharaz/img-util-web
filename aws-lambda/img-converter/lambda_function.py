import json
import os
import io
import boto3
from PIL import Image, ImageOps

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

SIZES = [256, 512, 768, 1024, 1536]
IMAGE_BUCKET = os.environ.get("IMAGE_BUCKET")
DYNAMODB_TABLE = os.environ.get("DYNAMODB_TABLE")
AWS_CDN_DOMAIN = os.environ.get("AWS_CDN_DOMAIN")


def format_size(size_bytes: int) -> str:
    """Format bytes to human readable string"""
    if size_bytes < 1024:
        return f"{size_bytes}B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f}KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f}MB"


def lambda_handler(event, context):
    print(event)
    tmpImageLocation = event["Records"][0]["dynamodb"]["NewImage"]["tmpImgLocation"][
        "S"
    ]
    userId = event["Records"][0]["dynamodb"]["NewImage"]["userId"]["S"]
    imageId = event["Records"][0]["dynamodb"]["NewImage"]["imageId"]["S"]

    converted_image_urls = process_image(tmpImageLocation)

    update_dynamodb(
        userId,
        imageId,
        tmpImageLocation,
        converted_image_urls,
    )

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


def process_image(key: str) -> list:
    """Process image and return list of converted image URLs"""
    converted_image_urls = []

    response = s3.get_object(Bucket=IMAGE_BUCKET, Key=key)
    input_bytes = response["Body"].read()
    original_size = len(input_bytes)

    with Image.open(io.BytesIO(input_bytes)) as img:
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")

        width, height = img.size
        max_original = max(width, height)

        sizes = [s for s in SIZES if s <= max_original]
        if not sizes:
            sizes = [max_original]

        base, ext = os.path.splitext(os.path.basename(key))
        directory = os.path.dirname(key)

        # Change output directory from instantuploads to userimages
        output_directory = directory.replace("instantuploads", "userimages", 1)

        # Copy original image to new location
        original_output_key = f"{output_directory}/{base}_original{ext}"
        s3.put_object(
            Bucket=IMAGE_BUCKET,
            Key=original_output_key,
            Body=input_bytes,
            ContentType=response.get("ContentType", "image/jpeg"),
            CacheControl="public, max-age=31536000, immutable",
        )

        # Add original image info first
        original_url = f"{AWS_CDN_DOMAIN}/{original_output_key}"
        converted_image_urls.append(
            {
                "resolution": f"{width}x{height}",
                "size": format_size(original_size),
                "url": original_url,
            }
        )

        for size in sizes:
            resized = img.copy()
            resized.thumbnail((size, size), Image.Resampling.LANCZOS)

            # Get the actual dimensions after resize
            resized_width, resized_height = resized.size

            buffer = io.BytesIO()
            resized.save(
                buffer,
                format="JPEG",
                quality=82,
                optimize=True,
                progressive=True,
            )
            buffer.seek(0)

            # Get the file size
            file_size = buffer.getbuffer().nbytes

            output_key = f"{output_directory}/{base}_{size}.jpg"

            s3.put_object(
                Bucket=IMAGE_BUCKET,
                Key=output_key,
                Body=buffer,
                ContentType="image/jpeg",
                CacheControl="public, max-age=31536000, immutable",
            )

            # Build the URL and add to converted_image_urls
            url = f"{AWS_CDN_DOMAIN}/{output_key}"
            converted_image_urls.append(
                {
                    "resolution": f"{resized_width}x{resized_height}",
                    "size": format_size(file_size),
                    "url": url,
                }
            )

            print(
                f"Uploaded {output_key} - {resized_width}x{resized_height}, {format_size(file_size)}"
            )

    # Delete original image from instantuploads location
    s3.delete_object(Bucket=IMAGE_BUCKET, Key=key)
    print(f"Deleted original image from {key}")

    return converted_image_urls
