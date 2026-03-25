import { Skeleton } from "@/components/ui/skeleton"

export default function HeroSliderSkeleton() {
  return (
    <div className="w-full mb-8">
      <div className="flex gap-4 h-[400px]">
        {/* Left Side - Main Slider Skeleton (60%) */}
        <div className="relative w-full lg:w-[60%] rounded-lg overflow-hidden bg-gray-200">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Right Side - Side Banners Skeleton (40%) */}
        <div className="hidden lg:flex flex-col gap-4 w-[40%]">
          {/* Top 2 Banners */}
          <div className="flex gap-4 h-[48%]">
            {/* Flash Sale Skeleton */}
            <div className="flex-1 bg-gray-200 rounded-lg p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-gray-300" />
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-3 w-20 bg-gray-300" />
              </div>
              <Skeleton className="h-8 w-16 bg-gray-300" />
            </div>
            
            {/* Best Seller Skeleton */}
            <div className="flex-1 bg-gray-200 rounded-lg p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-gray-300" />
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-3 w-20 bg-gray-300" />
              </div>
              <Skeleton className="h-8 w-20 bg-gray-300" />
            </div>
          </div>
          
          {/* Bottom Banner - New Arrival Skeleton */}
          <div className="h-[48%] bg-gray-200 rounded-lg p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-28 bg-gray-300" />
              <Skeleton className="h-6 w-3/4 bg-gray-300" />
              <Skeleton className="h-4 w-24 bg-gray-300" />
            </div>
            <Skeleton className="h-10 w-32 bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
