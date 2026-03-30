'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Flame, TrendingUp, Sparkles } from 'lucide-react'
import type { FeaturedProductsResponse } from '@/components/hero-slider/types'

interface SideBannersProps {
  featuredProducts: FeaturedProductsResponse | null
  loading?: boolean
  className?: string
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function SideBanners({ featuredProducts, loading = false, className = '' }: SideBannersProps) {
  const router = useRouter()

  const handleBannerClick = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  if (loading) {
    return (
      <div className={`hidden lg:flex flex-col gap-4 w-[40%] ${className}`}>
        {/* Loading State */}
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
      </div>
    )
  }

  return (
    <div className={`hidden lg:flex flex-col gap-4 w-[40%] ${className}`} role="complementary" aria-label="Featured products">
      {/* Top 2 Banners */}
      <div className="flex gap-4 h-[48%]">
        {/* Flash Sale Banner */}
        {featuredProducts?.flashSale ? (
          <div 
            onClick={() => handleBannerClick(featuredProducts.flashSale!.id)}
            className="relative flex-1 bg-gradient-to-br from-red-400 to-red-500 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            role="button"
            tabIndex={0}
            aria-label={`Flash sale: ${featuredProducts.flashSale.name}, ${featuredProducts.flashSale.discount}% off`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleBannerClick(featuredProducts.flashSale!.id)
              }
            }}
          >
            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-2">
                  <Flame className="w-3 h-3 mr-1" aria-hidden="true" />
                  FLASH SALE
                </Badge>
                <h3 className="font-bold text-sm mb-1 line-clamp-2">{featuredProducts.flashSale.name}</h3>
                <p className="text-xs opacity-90">{featuredProducts.flashSale.category}</p>
              </div>
              <div className="text-2xl font-bold" aria-label={`${featuredProducts.flashSale.discount} percent discount`}>
                -{featuredProducts.flashSale.discount}%
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-30">
              <img 
                src={featuredProducts.flashSale.image} 
                alt=""
                role="presentation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
            <p className="text-sm">No Flash Sale</p>
          </div>
        )}

        {/* Best Seller Banner */}
        {featuredProducts?.bestSeller ? (
          <div 
            onClick={() => handleBannerClick(featuredProducts.bestSeller!.id)}
            className="relative flex-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            role="button"
            tabIndex={0}
            aria-label={`Best seller: ${featuredProducts.bestSeller.name}, ${featuredProducts.bestSeller.sold} plus sold`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleBannerClick(featuredProducts.bestSeller!.id)
              }
            }}
          >
            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-2">
                  <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                  TERLARIS
                </Badge>
                <h3 className="font-bold text-sm mb-1 line-clamp-2">{featuredProducts.bestSeller.name}</h3>
                <p className="text-xs opacity-90">{featuredProducts.bestSeller.category}</p>
              </div>
              <div className="text-xl font-bold" aria-label={`${featuredProducts.bestSeller.sold} plus items sold`}>
                {featuredProducts.bestSeller.sold}+ Terjual
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-30">
              <img 
                src={featuredProducts.bestSeller.image} 
                alt=""
                role="presentation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
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
            role="button"
            tabIndex={0}
            aria-label={`New arrival: ${featuredProducts.newArrival.name}, priced at ${formatPrice(featuredProducts.newArrival.price)}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleBannerClick(featuredProducts.newArrival!.id)
              }
            }}
          >
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
              <div>
                <Badge className="bg-white/20 text-white border-0 mb-2">
                  <Sparkles className="w-4 h-4 mr-1" aria-hidden="true" />
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
                alt=""
                role="presentation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
            <p className="text-sm">No New Arrival</p>
          </div>
        )}
      </div>
    </div>
  )
}
