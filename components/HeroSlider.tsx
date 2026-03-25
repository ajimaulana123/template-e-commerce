'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Sparkles } from 'lucide-react'
import { MAIN_SLIDES, formatPrice } from './hero-slider/constants'
import type { FeaturedProductsResponse } from './hero-slider/types'

export default function HeroSlider() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch featured products
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

    // Auto slide timer
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MAIN_SLIDES.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % MAIN_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + MAIN_SLIDES.length) % MAIN_SLIDES.length)
  }

  const handleBannerClick = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  return (
    <div className="w-full mb-8">
      <div className="flex gap-4 h-[400px]">
        {/* Left Side - Main Slider (60%) */}
        <div className="relative w-full lg:w-[60%] rounded-lg overflow-hidden shadow-lg">
          <div className="flex transition-transform duration-500 ease-in-out h-full"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {MAIN_SLIDES.map((slide) => (
              <div key={slide.id} className={`min-w-full h-full ${slide.bgColor} relative flex items-center`}>
                <div className="container mx-auto px-6 lg:px-8 flex items-center h-full relative z-10">
                  {/* Content */}
                  <div className="text-white max-w-xl">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2">
                      {slide.title}
                    </h1>
                    <div className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 text-yellow-300">
                      {slide.subtitle}
                    </div>
                    <div className="text-base md:text-lg lg:text-xl font-semibold mb-3 text-yellow-200">
                      {slide.hashtag}
                    </div>
                    <p className="text-sm md:text-base lg:text-lg mb-2 opacity-90">
                      {slide.description}
                    </p>
                    <p className="text-xs md:text-sm lg:text-base mb-4 opacity-80">
                      {slide.period}
                    </p>
                    <div className="bg-yellow-400 text-gray-900 p-2 md:p-3 rounded-lg mb-4 font-bold text-xs md:text-sm lg:text-base">
                      {slide.cta}
                    </div>
                    <Button 
                      onClick={() => router.push(slide.link)}
                      className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-4 md:px-6 py-2 md:py-3"
                    >
                      Belanja Sekarang
                    </Button>
                  </div>

                  {/* Background Image */}
                  <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
                    <img 
                      src={slide.image} 
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {MAIN_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all",
                  currentSlide === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Side Banners (40%) */}
        <div className="hidden lg:flex flex-col gap-4 w-[40%]">
          {loading ? (
            /* Loading State */
            <>
              <div className="flex gap-4 h-[48%]">
                {/* Flash Sale Skeleton */}
                <div className="flex-1 bg-white rounded-lg p-4 space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                  <div className="flex-1" />
                  <Skeleton className="h-8 w-16" />
                </div>
                
                {/* Best Seller Skeleton */}
                <div className="flex-1 bg-white rounded-lg p-4 space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                  <div className="flex-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
              
              {/* New Arrival Skeleton */}
              <div className="h-[48%] bg-white rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-24" />
                <div className="flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>
            </>
          ) : (
            <>
              {/* Top 2 Banners */}
              <div className="flex gap-4 h-[48%]">
                {/* Flash Sale Banner */}
                {featuredProducts?.flashSale ? (
                  <div 
                    onClick={() => handleBannerClick(featuredProducts.flashSale!.id)}
                    className="relative flex-1 bg-gradient-to-br from-red-400 to-red-500 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
                      <div>
                        <Badge className="bg-white/20 text-white border-0 mb-2">
                          <Flame className="w-3 h-3 mr-1" />
                          FLASH SALE
                        </Badge>
                        <h3 className="font-bold text-sm mb-1 line-clamp-2">{featuredProducts.flashSale.name}</h3>
                        <p className="text-xs opacity-90">{featuredProducts.flashSale.category}</p>
                      </div>
                      <div className="text-2xl font-bold">-{featuredProducts.flashSale.discount}%</div>
                    </div>
                    <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-30">
                      <img 
                        src={featuredProducts.flashSale.image} 
                        alt={featuredProducts.flashSale.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white">
                    <p className="text-sm">No Flash Sale</p>
                  </div>
                )}

                {/* Best Seller Banner */}
                {featuredProducts?.bestSeller ? (
                  <div 
                    onClick={() => handleBannerClick(featuredProducts.bestSeller!.id)}
                    className="relative flex-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
                      <div>
                        <Badge className="bg-white/20 text-white border-0 mb-2">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          TERLARIS
                        </Badge>
                        <h3 className="font-bold text-sm mb-1 line-clamp-2">{featuredProducts.bestSeller.name}</h3>
                        <p className="text-xs opacity-90">{featuredProducts.bestSeller.category}</p>
                      </div>
                      <div className="text-xl font-bold">{featuredProducts.bestSeller.sold}+ Terjual</div>
                    </div>
                    <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-30">
                      <img 
                        src={featuredProducts.bestSeller.image} 
                        alt={featuredProducts.bestSeller.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white">
                    <p className="text-sm">No Best Seller</p>
                  </div>
                )}
              </div>

              {/* Bottom 1 Banner - New Arrival */}
              <div className="h-[48%]">
                {featuredProducts?.newArrival ? (
                  <div 
                    onClick={() => handleBannerClick(featuredProducts.newArrival!.id)}
                    className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                      <div>
                        <Badge className="bg-white/20 text-white border-0 mb-2">
                          <Sparkles className="w-4 h-4 mr-1" />
                          PRODUK BARU
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{featuredProducts.newArrival.name}</h3>
                        <p className="text-sm opacity-90">{featuredProducts.newArrival.category}</p>
                      </div>
                      <div className="text-3xl font-bold">{formatPrice(featuredProducts.newArrival.price)}</div>
                    </div>
                    <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30">
                      <img 
                        src={featuredProducts.newArrival.image} 
                        alt={featuredProducts.newArrival.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white">
                    <p className="text-sm">No New Arrival</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}