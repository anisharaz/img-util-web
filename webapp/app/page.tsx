import Link from "next/link";
import {
  ImageIcon,
  Zap,
  Copy,
  Cloud,
  Upload,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ImageUtil</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              Fast • Simple • Free
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Resize Images Instantly,{" "}
              <span className="text-primary">Copy URLs in Seconds</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Upload your photos and get multiple resized versions ready to use.
              One-click URL copying makes sharing effortless. No complex tools,
              no waiting.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Start Resizing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-full max-w-3xl rounded-xl border bg-muted/30 p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-background">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground md:rotate-0" />
                <div className="flex gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded border bg-background text-xs font-medium">
                    128px
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded border bg-background text-xs font-medium">
                    256px
                  </div>
                  <div className="flex h-24 w-24 items-center justify-center rounded border bg-background text-xs font-medium">
                    512px
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground md:rotate-0" />
                <div className="flex h-20 w-32 items-center justify-center rounded-lg border bg-background">
                  <Copy className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Copy URL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto max-w-6xl px-4 py-24"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple tools designed to save you time and effort.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Instant Resize</CardTitle>
                <CardDescription>
                  Upload once, get multiple sizes immediately. No waiting, no
                  processing delays.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <ImageIcon className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Multiple Formats</CardTitle>
                <CardDescription>
                  Support for common image formats. Get the right size for every
                  use case.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Copy className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">One-Click Copy</CardTitle>
                <CardDescription>
                  Copy image URLs instantly with a single click. Perfect for
                  quick sharing.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Cloud className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Cloud Storage</CardTitle>
                <CardDescription>
                  Your images are stored securely and available whenever you
                  need them.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <Separator />

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="container mx-auto max-w-6xl px-4 py-24"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to resize and share your images.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold">Upload</h3>
              <p className="mt-2 text-muted-foreground">
                Drag and drop or select your image file. We support all common
                formats.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold">Resize</h3>
              <p className="mt-2 text-muted-foreground">
                Your image is automatically resized to multiple dimensions
                instantly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold">Copy & Use</h3>
              <p className="mt-2 text-muted-foreground">
                Click any size to copy its URL. Paste anywhere and you&apos;re
                done.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* CTA Section */}
        <section className="container mx-auto max-w-6xl px-4 py-24">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 max-w-xl text-primary-foreground/80">
                Join thousands of users who save time with ImageUtil. Upload
                your first image and see the difference.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4" /> No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4" /> Free to use
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">ImageUtil</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ImageUtil. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
