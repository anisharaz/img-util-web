import Link from "next/link";
import { Upload, Images, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { formatBytes } from "@/lib/aws";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  let totalImages = 0;
  let storageUsed = "0 Bytes";

  totalImages = await prisma.images.count({
    where: { userId },
  });

  // Get total storage from Prisma UsageMetric
  const usageMetric = await prisma.usageMetric.findUnique({
    where: { userId: userId },
  });
  const totalBytes = (usageMetric?.totalStorageUsed ?? 0) * 1024 * 1024; // Convert MB to bytes
  storageUsed = formatBytes(totalBytes);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Upload and manage your images.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Upload className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">Upload Images</CardTitle>
            <CardDescription>
              Upload new images and get multiple resized versions instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/upload">
                Start Uploading
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Images className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">My Images</CardTitle>
            <CardDescription>
              View and manage all your uploaded images and their resized
              versions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/dashboard/images">
                View Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Images</CardDescription>
            <CardTitle className="text-4xl">{totalImages}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Storage Used</CardDescription>
            <CardTitle className="text-4xl">{storageUsed}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
