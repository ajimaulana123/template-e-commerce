import { Skeleton } from "@/components/ui/skeleton"

export default function HeroSliderSkeleton() {
  return (
    <div className="w-full mb-8">
      {/* Container: Tinggi disamakan dengan HeroSlider (min-h-[580px] di mobile) */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[580px] md:min-h-[500px] lg:h-[400px]">
        
        {/* Left Side - Main Slider Skeleton */}
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-gray-100 p-6 lg:p-12 flex flex-col justify-center">
          {/* Simulasi Konten Teks di dalam Slider */}
          <div className="space-y-4 relative z-10">
            <Skeleton className="h-6 w-32 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 md:h-16 w-3/4 bg-gray-200" />
              <Skeleton className="h-8 md:h-10 w-1/2 bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-full md:w-2/3 bg-gray-200" />
            <Skeleton className="h-10 w-28 bg-gray-200 rounded-lg" />
            <div className="pt-4">
              <Skeleton className="h-14 w-44 bg-gray-200 rounded-full" />
            </div>
          </div>
          
          {/* Simulasi Gambar di belakang (Opsional) */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <Skeleton className="w-full h-full bg-gray-300" />
          </div>
        </div>

        {/* Right Side - Side Banners Skeleton (Hanya muncul di Desktop) */}
        <div className="hidden lg:flex flex-col gap-4 w-[38%]">
          {/* Top 2 Banners Row */}
          <div className="flex gap-4 h-[48%]">
            {/* Flash Sale Skeleton */}
            <div className="flex-1 bg-gray-100 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20 bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
              </div>
              <Skeleton className="h-8 w-12 bg-gray-200" />
            </div>
            
            {/* Best Seller Skeleton */}
            <div className="flex-1 bg-gray-100 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20 bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
              </div>
              <Skeleton className="h-8 w-16 bg-gray-200" />
            </div>
          </div>
          
          {/* Bottom Banner - New Arrival Skeleton */}
          <div className="h-[48%] bg-gray-100 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24 bg-gray-200" />
              <Skeleton className="h-7 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
            </div>
            <Skeleton className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>
        </div>

      </div>
    </div>
  )
}