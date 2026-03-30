'use client'

import { useState, useEffect } from 'react'
import HeroSlider from '@/components/HeroSlider'
import HeroSliderSkeleton from '@/components/skeletons/HeroSliderSkeleton'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  className?: string
}

export default function HeroSection({ className }: HeroSectionProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulasi loading yang sedikit lebih realistis untuk aset gambar berat
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden bg-slate-50',
        // Memberikan aspek rasio yang konsisten agar tidak jumping saat loading
        'min-h-[500px] md:min-h-[600px] lg:min-h-[700px]',
        className
      )}
      aria-label="Hero Showcase"
    >
      {/* Skip Link Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 focus:z-[60] focus:px-6 focus:py-3 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-emerald-500/20 transition-all"
      >
        Skip to main content
      </a>

      {/* Main Content Container 
          Dibuat Full Width untuk Slider, 
          tapi skeleton tetap dijaga agar tidak layout shift 
      */}
      <div className="w-full h-full">
        {loading ? (
          <div className="container mx-auto px-4 py-8">
            <HeroSliderSkeleton />
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700 ease-out">
            <HeroSlider />
          </div>
        )}
      </div>

      {/* Dekorasi Background Halus (Opsional untuk estetika) */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10 sm:hidden" />
    </section>
  )
}