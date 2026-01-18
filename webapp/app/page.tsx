import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import {
  ImageIcon,
  Zap,
  Copy,
  Cloud,
  ArrowRight,
  Github,
  Globe,
  Server,
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
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ImageUtil</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#architecture"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Architecture
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#tech-stack"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Tech Stack
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">Try Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Personal Project • Open Source
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Cloud-Native{" "}
              <span className="text-primary">Image Processing</span> Pipeline
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              A serverless image resizing and CDN delivery system built with AWS
              Lambda, S3, CloudFront, and Next.js. Upload images and get
              instantly resized versions with CDN-backed URLs.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Try the Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#architecture">View Architecture</Link>
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Architecture Section - Main Focus */}
        <section
          id="architecture"
          className="container mx-auto max-w-6xl px-4 py-16"
        >
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              System Design
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Architecture Overview
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              A fully serverless architecture leveraging AWS services for
              scalable, cost-effective image processing.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="mt-12">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full bg-muted/20">
                  <Image
                    src="/arch.png"
                    alt="ImageUtil Architecture Diagram - AWS Lambda, S3, CloudFront, Next.js"
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Highlights */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="border-dashed">
              <CardHeader>
                <Server className="h-8 w-8 text-orange-500" />
                <CardTitle className="mt-3 text-lg">AWS Lambda</CardTitle>
                <CardDescription>
                  Serverless image processing with Python (Pillow) triggered by
                  S3 events. Auto-scales to handle any load.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-dashed">
              <CardHeader>
                <Cloud className="h-8 w-8 text-blue-500" />
                <CardTitle className="mt-3 text-lg">S3 + CloudFront</CardTitle>
                <CardDescription>
                  Original and resized images stored in S3, delivered globally
                  via CloudFront CDN for low latency.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-dashed">
              <CardHeader>
                <Globe className="h-8 w-8 text-green-500" />
                <CardTitle className="mt-3 text-lg">Next.js + Prisma</CardTitle>
                <CardDescription>
                  Modern React frontend with server components, backed by
                  PostgreSQL via Prisma ORM.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto max-w-6xl px-4 py-16"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for simplicity and developer experience.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Instant Processing</CardTitle>
                <CardDescription>
                  Images are automatically resized to multiple dimensions (128,
                  256, 512, 1024px) immediately after upload via Lambda.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Copy className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">One-Click Copy</CardTitle>
                <CardDescription>
                  Copy CDN-backed image URLs instantly. Each size has its own
                  URL for easy embedding.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Cloud className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Presigned Uploads</CardTitle>
                <CardDescription>
                  Direct-to-S3 uploads using presigned URLs. No server bandwidth
                  bottleneck, faster uploads.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Global CDN</CardTitle>
                <CardDescription>
                  CloudFront edge locations ensure images load fast anywhere in
                  the world.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Tech Stack Section */}
        <section
          id="tech-stack"
          className="container mx-auto max-w-6xl px-4 py-16"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Tech Stack
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Modern tools and services powering this project.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "Prisma",
              "PostgreSQL",
              "AWS Lambda",
              "AWS S3",
              "CloudFront",
              "Python",
              "Pillow",
              "Better Auth",
              "shadcn/ui",
            ].map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-sm px-4 py-2"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <Separator />

        {/* CTA Section */}
        <section className="container mx-auto max-w-6xl px-4 py-16">
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <Github className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Check It Out
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                This is a personal project exploring serverless architecture and
                modern web development. Feel free to try the demo or check out
                the code.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Try the Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
            A personal project by Anish • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
