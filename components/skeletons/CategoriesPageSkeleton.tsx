import { Skeleton } from '@/components/ui/skeleton'

export default function CategoriesPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <Skeleton className="w-6 h-6 mr-3" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        
        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Create Category Form */}
        <div className="order-2 xl:order-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-12 mb-2" />
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-12 w-12 rounded" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Category List */}
        <div className="order-1 xl:order-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-12 rounded-full" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden bg-white rounded-lg p-4 shadow-sm">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="grid grid-cols-3 gap-4 text-center">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <Skeleton className="w-5 h-5 mr-3 mt-1" />
          <div className="flex-1">
            <Skeleton className="h-5 w-40 mb-2" />
            <div className="space-y-1">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-3 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}