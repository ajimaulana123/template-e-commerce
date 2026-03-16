import { Skeleton } from "@/components/ui/skeleton"

interface ProductCardSkeletonProps {
  columns?: number
}

export default function ProductCardSkeleton({ columns = 6 }: ProductCardSkeletonProps) {
  const gridCols = {
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
  }

  return (
    <section className="mb-8">
      <div className="flex items-center mb-4">
        <Skeleton className="w-6 h-6 mr-3" />
        <Skeleton className="h-7 w-48" />
      </div>
      <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden border">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}