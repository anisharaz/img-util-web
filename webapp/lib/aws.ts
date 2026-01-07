import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const s3Client = new S3Client({
  region: "us-east-1",
  // TODO: use this while deploying
  //   credentials: {
  //     accessKeyId: process.env.AWS_S3_KEY as string,
  //     secretAccessKey: process.env.AWS_S3_SECRET as string,
  //   },
});

export async function GeneratePreSignedUrl(
  fileKey: string,
  contentType: string
) {
  const { BUCKET_NAME } = process.env;
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: BUCKET_NAME as string,
    Key: fileKey,
    Conditions: [
      ["content-length-range", 0, 10 * 1024 * 1024], // 10 MB max
    ],
    Fields: {
      success_action_status: "201",
      "Content-Type": contentType,
    },
    Expires: 3600,
  });
  return { url, fields };
}
