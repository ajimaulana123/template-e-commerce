import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ProductCardSkeletonProps {
  columns?: number
}

export default function ProductCardSkeleton({ columns = 6 }: ProductCardSkeletonProps) {
  return (
    <section className="mb-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="w-5 h-5 mr-2 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Product Grid Skeleton */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-3`}>
        {Array.from({ length: columns }).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-gray-200">
            <CardHeader className="p-0">
              <Skeleton className="w-full h-48 bg-gray-100" />
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {/* Product Name - 2 lines */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              {/* Rating and Sold */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="w-3 h-3 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="h-3 w-12" />
              </div>

              {/* Price */}
              <Skeleton className="h-5 w-24" />
              
              {/* Original Price (optional) */}
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}