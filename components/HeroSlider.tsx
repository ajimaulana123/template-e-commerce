'use client'

import { useState, useEffect, TouchEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Sparkles } from 'lucide-react'
import { MAIN_SLIDES, formatPrice } from './hero-slider/constants'
import type { FeaturedProductsResponse } from './hero-slider/types'
import HeroSliderSkeleton from './skeletons/HeroSliderSkeleton'

export default function HeroSlider() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const minSwipeDistance = 50

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/featured-products')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data)
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()

    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % MAIN_SLIDES.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [isPaused])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % MAIN_SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + MAIN_SLIDES.length) % MAIN_SLIDES.length)

  const handleBannerClick = (productId: string) => router.push(`/products/${productId}`)

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) nextSlide()
    else if (distance < -minSwipeDistance) prevSlide()
  }

  return (
    <div className="w-full">
      {/* Container: min-h ditingkatkan di mobile agar teks tidak sesak */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[550px] md:min-h-[500px] lg:h-[400px]">
        
        {/* LEFT SIDE - MAIN SLIDER */}
        <div 
          className="relative flex-1 rounded-2xl overflow-hidden shadow-xl bg-slate-200"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="flex transition-transform duration-700 ease-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {MAIN_SLIDES.map((slide) => (
              <div key={slide.id} className={cn("min-w-full h-full relative flex items-center", slide.bgColor)}>
                
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={slide.image} 
                    alt="" 
                    role="presentation"
                    className="w-full h-full object-cover object-center lg:object-right opacity-50 lg:opacity-30"
                  />
                  {/* Overlay Gradasi: Sangat penting agar teks putih terbaca di mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:to-transparent" />
                </div>

                {/* Content Container */}
                <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
                  <div className="text-white max-w-2xl py-12 lg:py-0">
                    <Badge className="bg-yellow-400 text-black border-0 mb-4 hover:bg-yellow-500">
                      {slide.hashtag}
                    </Badge>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-2 tracking-tight leading-tight">
                      {slide.title}
                    </h1>
                    <div className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 text-yellow-300">
                      {slide.subtitle}
                    </div>
                    <p className="text-sm md:text-lg mb-6 opacity-90 max-w-[90%] lg:max-w-md line-clamp-3">
                      {slide.description}
                    </p>
                    
                    <Button 
                      onClick={() => router.push(slide.link)}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold px-8 py-6 text-lg rounded-full transition-all transform hover:scale-105"
                    >
                      Belanja Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 z-30 hidden md:block">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 z-30 hidden md:block">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator: Dibuat lebih modern */}
          <div className="absolute bottom-6 left-6 lg:left-12 flex space-x-2 z-30">
            {MAIN_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-1.5 transition-all rounded-full",
                  currentSlide === index ? "bg-yellow-400 w-8" : "bg-white/40 w-4"
                )}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - SIDE BANNERS (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col gap-4 w-[35%]">
          {loading ? (
             <HeroSliderSkeleton />
          ) : (
            <>
              {/* Flash Sale & Best Seller Row */}
              <div className="flex gap-4 h-1/2">
                {featuredProducts?.flashSale && (
                  <div 
                    onClick={() => handleBannerClick(featuredProducts.flashSale!.id)}
                    className="relative flex-1 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-4 text-white overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                  >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <Badge className="w-fit bg-white/20 backdrop-blur-sm border-0"><Flame className="w-3 h-3 mr-1"/> FLASH SALE</Badge>
                      <div>
                        <div className="text-2xl font-black">-{featuredProducts.flashSale.discount}%</div>
                        <div className="text-xs font-medium line-clamp-1">{featuredProducts.flashSale.name}</div>
                      </div>
                    </div>
                    <img src={featuredProducts.flashSale.image} className="absolute -right-4 -bottom-4 w-24 h-24 object-contain opacity-40 group-hover:scale-110 transition-transform" />
                  </div>
                )}
                
                {featuredProducts?.bestSeller && (
                  <div 
                    onClick={() => handleBannerClick(featuredProducts.bestSeller!.id)}
                    className="relative flex-1 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl p-4 text-white overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
                  >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <Badge className="w-fit bg-white/20 backdrop-blur-sm border-0"><TrendingUp className="w-3 h-3 mr-1"/> TERLARIS</Badge>
                      <div>
                        <div className="text-xl font-black">{featuredProducts.bestSeller.sold}+</div>
                        <div className="text-xs font-medium line-clamp-1">Produk Terjual</div>
                      </div>
                    </div>
                    <img src={featuredProducts.bestSeller.image} className="absolute -right-4 -bottom-4 w-24 h-24 object-contain opacity-40 group-hover:scale-110 transition-transform" />
                  </div>
                )}
              </div>

              {/* New Arrival Banner */}
              {featuredProducts?.newArrival && (
                <div 
                  onClick={() => handleBannerClick(featuredProducts.newArrival!.id)}
                  className="h-1/2 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer group"
                >
                  <div className="relative z-10">
                    <Badge className="bg-white/20 border-0 mb-2"><Sparkles className="w-3 h-3 mr-1"/> BARU</Badge>
                    <h3 className="text-xl font-bold leading-tight mb-1">{featuredProducts.newArrival.name}</h3>
                    <div className="text-2xl font-black text-yellow-300">{formatPrice(featuredProducts.newArrival.price)}</div>
                  </div>
                  <img src={featuredProducts.newArrival.image} className="absolute right-0 bottom-0 h-full w-1/2 object-contain opacity-30 group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}