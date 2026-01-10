"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Upload, X, Check, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchPresignedUrl } from "@/app/actions/aws";
import { confirmUpload } from "@/app/actions";

export default function UploadForm() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean;
    imageId: string | null;
  }>({
    open: false,
    imageId: null,
  });

  // Generate preview URL when file changes
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  // Cleanup object URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const allowedTypes = ["image/png", "image/jpeg"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFile = Array.from(e.dataTransfer.files).find((f) =>
        allowedTypes.includes(f.type)
      );
      if (newFile) {
        if (newFile.size > maxSize) {
          alert("File size exceeds 10MB limit");
          return;
        }
        setFile(newFile);
      } else {
        alert("Please select a PNG or JPEG file");
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const allowedTypes = ["image/png", "image/jpeg"];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (e.target.files && e.target.files[0]) {
        const newFile = Array.from(e.target.files).find((f) =>
          allowedTypes.includes(f.type)
        );
        if (newFile) {
          if (newFile.size > maxSize) {
            alert("File size exceeds 10MB limit");
            e.target.value = "";
            return;
          }
          setFile(newFile);
        } else {
          alert("Please select a PNG or JPEG file");
        }
      }
      e.target.value = "";
    },
    []
  );

  const removeFile = useCallback(() => {
    setFile(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setUploading(true);

    const { fields, url, fileKey } = await fetchPresignedUrl({
      contentType: file.type,
      fileName: file.name,
    });

    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      alert("Image Upload Failed Try Again !");
    } else {
      await confirmUpload(fileKey.split("/").pop()?.split(".")[0] as string);
      setSuccessDialog({
        open: true,
        imageId: fileKey.split("/").pop()?.split(".")[0] as string,
      });
    }

    setUploading(false);
    setFile(null);
  }, [file]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{file ? "Selected File" : "Upload Area"}</CardTitle>
          <CardDescription>
            {file
              ? "Review before uploading."
              : "Drag and drop your images here, or click to browse. Only PNG and JPEG files are accepted."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="file-input"
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileSelect}
          />

          {file && preview ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={preview}
                  alt="Preview"
                  width={256}
                  height={256}
                  className="max-h-64 max-w-full rounded-lg object-contain"
                  unoptimized
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  Clear
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`relative flex min-h-75 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">Drop images here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Supports: JPG, PNG, (Max 10MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={successDialog.open}
        onOpenChange={(open) => setSuccessDialog({ open, imageId: null })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">
              Upload Successful!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your image has been uploaded successfully and is now being
              processed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setSuccessDialog({ open: false, imageId: null })}
            >
              Upload Another
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                if (successDialog.imageId) {
                  router.push(`/dashboard/images/${successDialog.imageId}`);
                }
              }}
            >
              View Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
