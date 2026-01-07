"use server";

import { auth } from "@/lib/auth";
import { GeneratePreSignedUrl } from "@/lib/aws";
import { headers } from "next/headers";

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
