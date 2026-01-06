"use server";

import { auth } from "@/lib/auth";
import { GetPreSignedUrl } from "@/lib/aws";

export async function fetchPresignedUrl({
  fileId,
  contentType,
}: {
  fileId: string;
  contentType: string;
}) {
  const session = (await auth.$context).session;
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  const fileKey = `instantuploads/${userId}/${fileId}`;
  const res = await GetPreSignedUrl(fileKey, contentType);
  return res;
}
