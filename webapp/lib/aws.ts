import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

export interface ConvertedImageUrl {
  size: string;
  resolution: string;
  url: string;
}

export interface DynamoDBImage {
  tmpImgLocation: string;
  imageId: string;
  convertedImageUrls: ConvertedImageUrl[];
  userId: string;
  "userid-imageid": string;
}

export const s3Client = new S3Client({
  region: "us-east-1",
  // TODO: use this while deploying
  //   credentials: {
  //     accessKeyId: process.env.AWS_KEY as string,
  //     secretAccessKey: process.env.AWS_SECRET as string,
  //   },
});

const dynamoDBClient = new DynamoDBClient({
  region: "us-east-1",
  // credentials: {
  //   accessKeyId: process.env.AWS_KEY as string,
  //   secretAccessKey: process.env.AWS_SECRET as string,
  // },
});

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

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

export async function imagesFromDynamodb({
  userId,
  imageId,
  tableName,
}: {
  userId: string;
  imageId: string;
  tableName: string;
}) {
  const key = `${userId}-${imageId}`;

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      "userid-imageid": key,
    },
  });

  const response = await docClient.send(command);
  return response.Item;
}

export async function getAllImagesForUser({
  userId,
  tableName,
}: {
  userId: string;
  tableName: string;
}): Promise<DynamoDBImage[]> {
  const command = new ScanCommand({
    TableName: tableName,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const response = await docClient.send(command);
  return (response.Items || []) as DynamoDBImage[];
}

export async function deleteImageFromDynamoDB({
  userId,
  imageId,
  tableName,
}: {
  userId: string;
  imageId: string;
  tableName: string;
}): Promise<void> {
  const key = `${userId}-${imageId}`;

  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      "userid-imageid": key,
    },
  });

  await docClient.send(command);
}
