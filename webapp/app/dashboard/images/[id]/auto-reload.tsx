"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AutoReloadProps {
  isProcessing: boolean;
  intervalMs?: number;
}

export function AutoReload({
  isProcessing,
  intervalMs = 5000,
}: AutoReloadProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isProcessing, intervalMs, router]);

  return null;
}
