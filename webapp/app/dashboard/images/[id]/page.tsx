import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { imagesFromDynamodb, type DynamoDBImage } from "@/lib/aws";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CopyButton } from "./copy-button";

export default async function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    notFound();
  }

  const image = (await imagesFromDynamodb({
    userId,
    imageId: id,
    tableName: process.env.DYNAMODB_TABLE_NAME as string,
  })) as DynamoDBImage | undefined;

  if (!image) {
    notFound();
  }

  // Get the original image (highest resolution)
  const originalImage = image.convertedImageUrls?.find((img) =>
    img.url.includes("/original.")
  );

  // Get resized versions (exclude original)
  const resizedVersions =
    image.convertedImageUrls?.filter(
      (img) => !img.url.includes("/original.")
    ) || [];

  // Extract filename from imageId
  const getImageName = (imageId: string) => {
    const parts = imageId.split("_");
    return parts.slice(1).join("_") || imageId;
  };

  // Extract format from URL
  const getFormat = (url: string) => {
    const ext = url.split(".").pop()?.toUpperCase();
    return ext || "Unknown";
  };

  const imageName = getImageName(image.imageId);
  const format = originalImage ? getFormat(originalImage.url) : "Unknown";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/images">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{imageName}</h1>
          <p className="text-muted-foreground">Image ID: {image.imageId}</p>
        </div>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Original Image Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
            <CardDescription>
              {originalImage?.resolution} • {originalImage?.size} • {format}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalImage?.url}
                alt={imageName}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {originalImage && <CopyButton url={originalImage.url} />}
              <Button variant="outline" size="sm" asChild>
                <a
                  href={originalImage?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Original
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={originalImage?.url} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Image Info */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="font-medium">{imageName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Dimensions</p>
              <p className="font-medium">
                {originalImage?.resolution || "N/A"}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="font-medium">{originalImage?.size || "N/A"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Format</p>
              <p className="font-medium">{format}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Resized Versions</p>
              <p className="font-medium">{resizedVersions.length} sizes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resized Versions */}
      <Card>
        <CardHeader>
          <CardTitle>Resized Versions</CardTitle>
          <CardDescription>
            Click &quot;Copy URL&quot; to copy the image URL to your clipboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resizedVersions.map((version) => (
              <div
                key={version.url}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={version.url}
                    alt={`${imageName} - ${version.resolution}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {version.resolution}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{version.size}</p>
                  <CopyButton url={version.url} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* URL Quick Copy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Copy URLs</CardTitle>
          <CardDescription>Copy URLs for all sizes at once.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {image.convertedImageUrls?.map((version) => (
              <div
                key={version.url}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Badge
                  variant="outline"
                  className="shrink-0 w-24 justify-center"
                >
                  {version.resolution}
                </Badge>
                <code className="flex-1 truncate text-sm bg-muted px-2 py-1 rounded">
                  {version.url}
                </code>
                <CopyButton url={version.url} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
