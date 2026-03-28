import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardStatsSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}