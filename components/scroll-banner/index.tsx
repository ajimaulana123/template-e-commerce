'use client'

import { cn } from '@/lib/utils'
import { useScrollVisibility } from './useScrollVisibility'
import BannerContent from './BannerContent'
import { BANNER_CONFIGS } from './constants'

export default function ScrollBanner() {
  const isVisible = useScrollVisibility()

  // Gunakan satu container utama dengan logic responsive di dalamnya
  // untuk menghindari duplikasi DOM yang tidak perlu
  return (
    <div
      className={cn(
        // Layout & Animation
        'fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out transform',
        // Styling: Dark mode look biasanya terasa lebih premium untuk banner promo
        'bg-neutral-900 text-white shadow-sm',
        // Smooth slide up/down logic
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      <div className="relative overflow-hidden group">
        {/* Subtle decorative gradient background (Opsional untuk estetika) */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-purple-600/20 opacity-50" />

        <div className="relative mx-auto flex items-center justify-center min-h-[40px] md:min-h-[44px]">
          {/* Responsive Banner Logic */}
          <div className="2xl:block hidden">
            <BannerContent config={BANNER_CONFIGS['2xl']} linkSize="lg" />
          </div>
          
          <div className="xl:block 2xl:hidden hidden">
            <BannerContent config={BANNER_CONFIGS.xl} linkSize="md" />
          </div>

          <div className="lg:block xl:hidden hidden">
            <BannerContent config={BANNER_CONFIGS.lg} linkSize="md" />
          </div>

          <div className="md:block lg:hidden hidden px-4">
            <BannerContent config={BANNER_CONFIGS.md} linkSize="md" />
          </div>

          <div className="sm:block md:hidden hidden px-4">
            <BannerContent config={BANNER_CONFIGS.sm} linkSize="sm" />
          </div>

          <div className="block sm:hidden px-3">
            <BannerContent config={BANNER_CONFIGS.xs} linkSize="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}