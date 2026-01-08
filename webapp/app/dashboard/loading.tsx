import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="mt-4 h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-36" />
          </CardContent>
        </Card>

        {/* My Images Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="mt-4 h-6 w-28" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-10 w-16" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-10 w-24" />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
