'use client'

import { cn } from '@/lib/utils'
import { useScrollVisibility } from './useScrollVisibility'
import BannerContent from './BannerContent'
import { BANNER_CONFIGS } from './constants'

export default function ScrollBanner() {
  const isVisible = useScrollVisibility()

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white transition-transform duration-300 ease-in-out',
        // No bottom border to connect seamlessly with navbar
        'shadow-sm',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      {/* Extra Large Desktop (2xl+) */}
      <div className="hidden 2xl:block">
        <BannerContent config={BANNER_CONFIGS['2xl']} linkSize="lg" />
      </div>

      {/* Large Desktop (xl-2xl) */}
      <div className="hidden xl:block 2xl:hidden">
        <BannerContent config={BANNER_CONFIGS.xl} linkSize="md" />
      </div>

      {/* Medium Desktop (lg-xl) */}
      <div className="hidden lg:block xl:hidden">
        <BannerContent config={BANNER_CONFIGS.lg} linkSize="md" />
      </div>

      {/* Tablet (md-lg) */}
      <div className="hidden md:block lg:hidden">
        <BannerContent config={BANNER_CONFIGS.md} containerClass="px-4" linkSize="md" />
      </div>

      {/* Small Mobile (sm-md) */}
      <div className="hidden sm:block md:hidden">
        <BannerContent config={BANNER_CONFIGS.sm} containerClass="px-4" linkSize="sm" />
      </div>

      {/* Extra Small Mobile (<sm) */}
      <div className="block sm:hidden">
        <BannerContent config={BANNER_CONFIGS.xs} containerClass="px-3" linkSize="sm" />
      </div>
    </div>
  )
}
