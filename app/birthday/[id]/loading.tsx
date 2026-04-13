import { Skeleton } from "@/components/ui/skeleton";

export default function BirthdayLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center space-y-4 py-12">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto h-12 w-80" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="mx-auto h-5 w-48" />
          <Skeleton className="mx-auto h-4 w-96" />
        </div>
      </div>
    </div>
  );
}
