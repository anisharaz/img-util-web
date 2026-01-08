import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ImageUtil</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-20" />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto max-w-6xl px-4 py-20 text-center">
        <Skeleton className="mx-auto h-6 w-40 rounded-full" />
        <Skeleton className="mx-auto mt-6 h-12 w-3/4 max-w-2xl" />
        <Skeleton className="mx-auto mt-2 h-12 w-2/3 max-w-xl" />
        <Skeleton className="mx-auto mt-6 h-6 w-1/2 max-w-lg" />
        <div className="mt-10 flex justify-center gap-4">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-32" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border p-6">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
