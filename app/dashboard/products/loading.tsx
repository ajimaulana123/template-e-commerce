import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ProductsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats Card Skeleton */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-8 w-64 bg-white/20 mb-2" />
            <Skeleton className="h-4 w-48 bg-white/20" />
          </div>
          <Skeleton className="w-16 h-16 rounded-xl bg-white/20" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Skeleton className="h-3 w-20 bg-white/20 mb-2" />
              <Skeleton className="h-8 w-16 bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Search and Actions Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="flex-1 h-12 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Product List Card Skeleton */}
      <Card className="shadow-sm border border-gray-200 rounded-xl">
        <CardHeader className="bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 rounded-b-xl">
          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex gap-3">
                  {/* Product Image Skeleton */}
                  <Skeleton className="w-20 h-20 flex-shrink-0 rounded-lg" />

                  {/* Product Info Skeleton */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-4 w-12" />
                    </div>

                    <div className="space-y-1">
                      <Skeleton className="h-5 w-24" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Skeleton className="flex-1 h-9 rounded-lg" />
                  <Skeleton className="flex-1 h-9 rounded-lg" />
                  <Skeleton className="flex-1 h-9 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
