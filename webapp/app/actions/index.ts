"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export async function confirmUpload(imageId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await prisma.images.create({
    data: {
      userId: session.user.id,
      imageId: imageId,
    },
  });
  return res;
}
