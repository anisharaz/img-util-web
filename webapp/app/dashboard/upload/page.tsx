"use client";

import { useState, useCallback } from "react";
import { Upload, ImageIcon, X, Check } from "lucide-react";
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
import { subtle } from "crypto";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
        setFile(newFile ?? null);
      }
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
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    console.log(hashHex);
    return;

    const { fields, url } = await fetchPresignedUrl({
      contentType: file.type,
      fileId: hashHex,
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
    }

    setUploading(false);
    setFile(null);
    // Show success message or redirect
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
          <CardTitle>Upload Area</CardTitle>
          <CardDescription>
            Drag and drop your images here, or click to browse.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <Input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Drop images here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Selected File</CardTitle>
            <CardDescription>Review before uploading.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
