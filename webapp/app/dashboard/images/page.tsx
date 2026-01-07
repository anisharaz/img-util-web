import Link from "next/link";
import { MoreHorizontal, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAllImagesForUser,
  type ConvertedImageUrl,
  type DynamoDBImage,
} from "@/lib/aws";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ImagesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  const images: DynamoDBImage[] = userId
    ? await getAllImagesForUser({
        userId,
        tableName: process.env.DYNAMODB_TABLE_NAME as string,
      })
    : [];

  // Get the smallest resolution image as thumbnail (usually 256px)
  const getSmallestImage = (convertedUrls: ConvertedImageUrl[]) => {
    if (!convertedUrls || convertedUrls.length === 0) return null;
    // Find the 256px version or the smallest one
    const thumbnail = convertedUrls.find((img) => img.url.includes("/256."));
    return thumbnail || convertedUrls[0];
  };

  // Extract filename from imageId
  const getImageName = (imageId: string) => {
    // imageId format: "2026-01-07T08-41-30-796Z_Screenshot_20260105_141443"
    const parts = imageId.split("_");
    return parts.slice(1).join("_") || imageId;
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Images</h1>
          <p className="text-muted-foreground">
            View and manage all your uploaded images.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">Upload New</Link>
        </Button>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No images yet</p>
            <p className="text-muted-foreground">
              Upload your first image to get started.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/upload">Upload Image</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => {
            const thumbnail = getSmallestImage(image.convertedImageUrls);
            const imageName = getImageName(image.imageId);
            return (
              <Card
                key={image["userid-imageid"]}
                className="overflow-hidden group"
              >
                <Link href={`/dashboard/images/${image.imageId}`}>
                  <div className="relative aspect-square bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnail?.url}
                      alt={imageName}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                </Link>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {imageName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {image.convertedImageUrls?.length || 0} sizes
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/images/${image.imageId}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
