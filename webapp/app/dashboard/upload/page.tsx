"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Upload, X, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchPresignedUrl } from "@/app/actions/aws";
import { confirmUpload } from "@/app/actions";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFile = Array.from(e.dataTransfer.files).find((f) =>
        f.type.startsWith("image/")
      );
      setFile(newFile ?? null);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const newFile = Array.from(e.target.files).find((f) =>
          f.type.startsWith("image/")
        );
        if (newFile) {
          setFile(newFile);
        } else {
          alert("Please select a valid image file");
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

    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const imageHashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const { fields, url } = await fetchPresignedUrl({
      contentType: file.type,
      fileId: imageHashHex,
      fileExtension: file.name.split(".").pop()?.toLowerCase() as string,
    });

    setUploading(true);
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
      await confirmUpload(imageHashHex);
    }

    setUploading(false);
    setFile(null);

    // TODO: redirect to the image page after an alert
    alert("Image Uploaded Successfully !");
  }, [file]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Images</h1>
        <p className="text-muted-foreground">
          Upload your images to resize them automatically.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{file ? "Selected File" : "Upload Area"}</CardTitle>
          <CardDescription>
            {file
              ? "Review before uploading."
              : "Drag and drop your images here, or click to browse."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="file-input"
            type="file"
            accept="image/*"
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
                Supports: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
