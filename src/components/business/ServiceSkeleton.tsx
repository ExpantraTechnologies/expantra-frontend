"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ServiceSkeleton() {
  return (
    <div className="space-y-4">

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="border-b py-3 grid grid-cols-5 gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="border-b py-3 grid grid-cols-5 gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="border-b py-3 grid grid-cols-5 gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="md:hidden space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-md p-4 space-y-3 shadow-sm"
          >
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>

            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
