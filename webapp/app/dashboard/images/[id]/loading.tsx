import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ImageDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Original Image Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>

        {/* Image Info */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-1 h-5 w-32" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-5 w-28" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-1 h-5 w-24" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-1 h-5 w-16" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1 h-5 w-20" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-1 h-5 w-28" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resized Versions */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border p-4 space-y-3">
                <Skeleton className="aspect-square w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Copy URLs */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-1 h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
