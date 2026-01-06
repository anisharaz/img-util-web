"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function confirmUpload(imageId: string) {
  const session = (await auth.$context).session;
  if (!session) {
    throw new Error("Unauthorized");
  }
  await prisma.images.create({
    data: {
      userId: session.user.id,
      hash: imageId,
    },
  });
}
