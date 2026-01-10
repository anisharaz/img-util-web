"use server";

import { auth } from "@/lib/auth";
import {
  GeneratePreSignedUrl,
  deleteImageFromDynamoDB,
  imagesFromDynamodb,
  type DynamoDBImage,
} from "@/lib/aws";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function fetchPresignedUrl({
  contentType,
  fileName,
}: {
  contentType: string;
  fileName: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  const fileKey = `instantuploads/${userId}/${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}_${fileName}`;
  const { fields, url } = await GeneratePreSignedUrl(fileKey, contentType);
  return { fields, url, fileKey };
}

export async function deleteImage(imageId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // Verify the image belongs to the user
  const prismaImage = await prisma.images.findFirst({
    where: {
      imageId: imageId,
      userId: userId,
    },
  });

  if (!prismaImage) {
    throw new Error("Image not found");
  }

  // Fetch image details from DynamoDB to calculate storage to deduct
  const dynamoImage = (await imagesFromDynamodb({
    userId,
    imageId,
    tableName: process.env.DYNAMODB_TABLE_NAME as string,
  })) as DynamoDBImage | undefined;

  // Calculate total bytes to deduct from usage
  let bytesToDeduct = 0;
  if (dynamoImage?.convertedImageUrls) {
    bytesToDeduct = dynamoImage.convertedImageUrls.reduce((total, img) => {
      return total + img.size;
    }, 0);
  }

  // Delete from DynamoDB
  await deleteImageFromDynamoDB({
    userId,
    imageId,
    tableName: process.env.DYNAMODB_TABLE_NAME as string,
  });

  // Delete from Prisma (PostgreSQL)
  await prisma.images.delete({
    where: {
      id: prismaImage.id,
    },
  });

  // Update UsageMetric to deduct storage
  if (bytesToDeduct > 0) {
    await prisma.usageMetric.update({
      where: {
        userId: userId,
      },
      data: {
        totalStorageUsed: {
          decrement: BigInt(bytesToDeduct),
        },
      },
    });
  }

  redirect("/dashboard/images");
}
