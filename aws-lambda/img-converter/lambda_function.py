import json
import os
import io
import boto3
from PIL import Image, ImageOps

s3 = boto3.client("s3")

SIZES = [256, 512, 768, 1024, 1536]


def lambda_handler(event, context):
    print(event)
    userid_imageid_value = event["Records"][0]["dynamodb"]["Keys"]["userid-imageid"][
        "S"
    ]
    parsed_value = json.loads(userid_imageid_value)
    print("Parsed value:", parsed_value)
    process_image(parsed_value["bucket"], parsed_value["key"])
    return {"statusCode": 200, "body": json.dumps("Hello from Lambda!")}


def process_image(bucket: str, key: str):
    response = s3.get_object(Bucket=bucket, Key=key)
    input_bytes = response["Body"].read()

    with Image.open(io.BytesIO(input_bytes)) as img:
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")

        width, height = img.size
        max_original = max(width, height)

        sizes = [s for s in SIZES if s <= max_original]
        if not sizes:
            sizes = [max_original]

        base, _ = os.path.splitext(os.path.basename(key))
        directory = os.path.dirname(key)

        for size in sizes:
            resized = img.copy()
            resized.thumbnail((size, size), Image.Resampling.LANCZOS)

            buffer = io.BytesIO()
            resized.save(
                buffer,
                format="JPEG",
                quality=82,
                optimize=True,
                progressive=True,
            )
            buffer.seek(0)

            output_key = f"{directory}/{base}_{size}.jpg"

            s3.put_object(
                Bucket=bucket,
                Key=output_key,
                Body=buffer,
                ContentType="image/jpeg",
                CacheControl="public, max-age=31536000, immutable",
            )
