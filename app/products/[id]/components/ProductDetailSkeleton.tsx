import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <Skeleton className="h-9 w-32 mb-4" />

        <div className="space-y-6">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center space-x-2 text-sm">
            <Skeleton className="h-4 w-16" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-20" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section Skeleton */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <Skeleton className="w-full h-96 bg-gray-200" />
              </Card>
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg bg-gray-200" />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                  </div>

                  {/* Rating and Badge */}
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-5 w-32" />
                  </div>

                  {/* Description */}
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>

              {/* Quantity Selector Skeleton */}
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
              </div>

              {/* Product Details Skeleton */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reviews Section Skeleton */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-12 pt-8 border-t">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48 bg-gray-200" />
                  <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
