import { Skeleton } from "@/components/ui/skeleton";

export default function SignInLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-950">
        <div className="text-center">
          <Skeleton className="mx-auto h-9 w-48" />
          <Skeleton className="mx-auto mt-2 h-5 w-56" />
        </div>

        <div className="mt-8">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
