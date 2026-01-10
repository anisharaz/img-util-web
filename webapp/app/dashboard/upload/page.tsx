import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { formatBytes } from "@/lib/aws";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadForm from "./upload-form";

export default async function UploadPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  // Get usage metrics for the user
  const usageMetric = await prisma.usageMetric.findUnique({
    where: { userId: userId },
  });

  const storageUsed = Number(usageMetric?.totalStorageUsed ?? 0);
  const storageLimit = Number(usageMetric?.totalStorageLimit ?? 52428800); // Default 50MB

  const canUpload = storageUsed < storageLimit;
  const usagePercentage = Math.min((storageUsed / storageLimit) * 100, 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Images</h1>
        <p className="text-muted-foreground">
          Upload your images to resize them automatically.
        </p>
      </div>

      {/* Storage Usage Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Storage Usage</CardDescription>
          <CardTitle className="text-2xl">
            {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                usagePercentage >= 100
                  ? "bg-destructive"
                  : usagePercentage >= 80
                  ? "bg-yellow-500"
                  : "bg-primary"
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {usagePercentage.toFixed(1)}% of storage used
          </p>
        </CardContent>
      </Card>

      {canUpload ? (
        <UploadForm />
      ) : (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">
                Storage Limit Reached
              </CardTitle>
            </div>
            <CardDescription>
              You have reached your storage limit of {formatBytes(storageLimit)}
              . Please delete some images to free up space before uploading new
              ones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/images">Manage Images</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
