"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReloadButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleReload = () => {
    setIsLoading(true);
    router.refresh();
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReload}
      disabled={isLoading}
    >
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
      />
      {isLoading ? "Refreshing..." : "Reload"}
    </Button>
  );
}
