"use server";

import { auth } from "@/lib/auth";
import { GetPreSignedUrl } from "@/lib/aws";

export async function fetchPresignedUrl({
  fileId,
  contentType,
  fileExtension,
}: {
  fileId: string;
  contentType: string;
  fileExtension: string;
}) {
  const session = (await auth.$context).session;
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  const fileKey = `instantuploads/${userId}/${fileId}_${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.${fileExtension}`;
  const res = await GetPreSignedUrl(fileKey, contentType);
  return res;
}
