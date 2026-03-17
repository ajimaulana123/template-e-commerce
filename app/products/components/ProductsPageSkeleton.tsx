import { Skeleton } from '@/components/ui/skeleton'

export function ProductsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Skeleton className="h-6 lg:h-8 w-32 lg:w-48 mb-2" />
            <Skeleton className="h-4 w-24 lg:w-32" />
          </div>
          <Skeleton className="h-10 w-full lg:w-64" />
        </div>
      </div>

      {/* Mobile Category Filter Skeleton */}
      <div className="lg:hidden bg-white rounded-lg p-4">
        <Skeleton className="h-5 w-20 mb-3" />
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 h-8 w-20" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-lg p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="col-span-1 lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
