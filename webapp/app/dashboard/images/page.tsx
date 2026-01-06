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

// Mock data for images
const mockImages = [
  {
    id: "img-001",
    name: "landscape-photo.jpg",
    originalUrl: "https://picsum.photos/seed/1/800/600",
    thumbnailUrl: "https://picsum.photos/seed/1/300/200",
    uploadedAt: "2026-01-05",
    sizes: 4,
  },
  {
    id: "img-002",
    name: "portrait-shot.png",
    originalUrl: "https://picsum.photos/seed/2/600/800",
    thumbnailUrl: "https://picsum.photos/seed/2/200/300",
    uploadedAt: "2026-01-04",
    sizes: 4,
  },
  {
    id: "img-003",
    name: "product-image.jpg",
    originalUrl: "https://picsum.photos/seed/3/800/800",
    thumbnailUrl: "https://picsum.photos/seed/3/300/300",
    uploadedAt: "2026-01-03",
    sizes: 4,
  },
  {
    id: "img-004",
    name: "banner-wide.png",
    originalUrl: "https://picsum.photos/seed/4/1200/400",
    thumbnailUrl: "https://picsum.photos/seed/4/300/100",
    uploadedAt: "2026-01-02",
    sizes: 4,
  },
  {
    id: "img-005",
    name: "icon-design.png",
    originalUrl: "https://picsum.photos/seed/5/500/500",
    thumbnailUrl: "https://picsum.photos/seed/5/250/250",
    uploadedAt: "2026-01-01",
    sizes: 4,
  },
  {
    id: "img-006",
    name: "hero-section.jpg",
    originalUrl: "https://picsum.photos/seed/6/1600/900",
    thumbnailUrl: "https://picsum.photos/seed/6/320/180",
    uploadedAt: "2025-12-31",
    sizes: 4,
  },
];

export default function ImagesPage() {
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

      {mockImages.length === 0 ? (
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
          {mockImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <Link href={`/dashboard/images/${image.id}`}>
                <div className="relative aspect-square bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.thumbnailUrl}
                    alt={image.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              </Link>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{image.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {image.sizes} sizes • {image.uploadedAt}
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
                        <Link href={`/dashboard/images/${image.id}`}>
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
          ))}
        </div>
      )}
    </div>
  );
}
