"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  ExternalLink,
  Trash2,
} from "lucide-react";
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

// Mock data for a single image with resized versions
const getMockImageData = (id: string) => ({
  id,
  name: "landscape-photo.jpg",
  originalUrl: `https://picsum.photos/seed/${id}/1600/1200`,
  uploadedAt: "2026-01-05",
  fileSize: "2.4 MB",
  dimensions: "1600 x 1200",
  format: "JPEG",
  resizedVersions: [
    {
      size: "128x128",
      label: "Thumbnail",
      url: `https://picsum.photos/seed/${id}/128/128`,
      fileSize: "12 KB",
    },
    {
      size: "256x256",
      label: "Small",
      url: `https://picsum.photos/seed/${id}/256/256`,
      fileSize: "32 KB",
    },
    {
      size: "512x512",
      label: "Medium",
      url: `https://picsum.photos/seed/${id}/512/512`,
      fileSize: "89 KB",
    },
    {
      size: "1024x1024",
      label: "Large",
      url: `https://picsum.photos/seed/${id}/1024/1024`,
      fileSize: "245 KB",
    },
  ],
});

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="shrink-0"
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copy URL
        </>
      )}
    </Button>
  );
}

export default function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const image = getMockImageData(id);

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
          <h1 className="text-2xl font-bold tracking-tight">{image.name}</h1>
          <p className="text-muted-foreground">
            Uploaded on {image.uploadedAt}
          </p>
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
              {image.dimensions} • {image.fileSize} • {image.format}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.originalUrl}
                alt={image.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton url={image.originalUrl} />
              <Button variant="outline" size="sm" asChild>
                <a
                  href={image.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Original
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={image.originalUrl} download>
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
              <p className="font-medium">{image.name}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Dimensions</p>
              <p className="font-medium">{image.dimensions}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="font-medium">{image.fileSize}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Format</p>
              <p className="font-medium">{image.format}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Resized Versions</p>
              <p className="font-medium">
                {image.resizedVersions.length} sizes
              </p>
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
            {image.resizedVersions.map((version) => (
              <div
                key={version.size}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={version.url}
                    alt={`${image.name} - ${version.size}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{version.label}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {version.fileSize}
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
            {image.resizedVersions.map((version) => (
              <div
                key={version.size}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Badge
                  variant="outline"
                  className="shrink-0 w-20 justify-center"
                >
                  {version.size}
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
