'use client'

import React from 'react'
import ProductGrid from '@/components/ProductGrid'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import CountdownTimer from './CountdownTimer'
import UrgencyIndicator from './UrgencyIndicator'

interface Product {
  id?: string
  name: string
  price: string
  originalPrice?: string
  image?: string
  images?: string[]
  rating?: number
  sold?: string
  badge?: string
  stockRemaining?: number
  viewCount?: number
}

interface FlashSaleSectionProps {
  title?: string
  products: Product[]
  endTime?: Date
  maxProducts?: number
  className?: string
}

/**
 * FlashSaleSection Component
 * 
 * Displays flash sale products with distinctive styling to create urgency.
 * Features:
 * - Gradient border for visual prominence
 * - Special background styling
 * - Icon-enhanced heading (using Lucide icon instead of emoji)
 * - Integrated product grid
 * 
 * Validates: Requirements 5.1, 7.2
 */
export default function FlashSaleSection({
  title = 'Flash Sale Hari Ini',
  products,
  endTime,
  maxProducts = 6,
  className
}: FlashSaleSectionProps) {
  // Limit products to maxProducts
  const displayProducts = products.slice(0, maxProducts)

  if (displayProducts.length === 0) {
    return null
  }

  return (
    <section 
      className={cn(
        // Distinctive styling with gradient border
        "relative mb-8 rounded-lg overflow-hidden",
        // Gradient border effect using pseudo-element
        "before:absolute before:inset-0 before:rounded-lg before:p-[2px]",
        "before:bg-gradient-to-r before:from-red-500 before:via-orange-500 before:to-yellow-500",
        "before:-z-10",
        className
      )}
      aria-label="Flash sale section"
    >
      {/* Inner container with special background */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-lg p-6">
        {/* Prominent heading with icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Icon component for accessibility */}
            <div 
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full"
              aria-hidden="true"
            >
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Flash Sale Hari Ini
            </h2>
          </div>
          
          {/* View all link */}
          <a 
            href="/products?filter=flash-sale" 
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors animate-cta-glow"
            aria-label="View all flash sale products"
          >
            Lihat Semua <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </div>

        {/* Countdown Timer */}
        {endTime && (
          <div className="mb-6">
            <CountdownTimer endTime={endTime} size="md" />
          </div>
        )}

        {/* Product Grid Integration */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id || i} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * ProductCard Component
 * Displays individual product within the flash sale section
 */
function ProductCard({ product }: { product: Product }) {
  const CardContent = (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50 h-48">
        <img 
          src={product.images?.[0] || product.image || '/placeholder.png'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm mb-2 line-clamp-2 h-10 text-gray-800 font-medium">
          {product.name}
        </h3>
        
        {/* Rating and Sold */}
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }, (_, j) => (
            <i 
              key={j} 
              className={cn(
                "fas fa-star text-xs",
                j < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
              )}
            />
          ))}
          {product.sold && (
            <span className="text-xs text-gray-500 ml-2">({product.sold})</span>
          )}
        </div>

        {/* Urgency Indicators */}
        <div className="mb-2">
          <UrgencyIndicator 
            stockRemaining={product.stockRemaining}
            viewCount={product.viewCount}
            variant="compact"
          />
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="text-base font-bold text-red-600">{product.price}</div>
          {product.originalPrice && (
            <div className="text-xs text-gray-500 line-through">{product.originalPrice}</div>
          )}
        </div>
      </div>
    </div>
  )

  // Wrap with link if product has ID
  if (product.id) {
    return (
      <a 
        href={`/products/${product.id}`} 
        className="block"
        aria-label={`View flash sale details for ${product.name}`}
      >
        {CardContent}
      </a>
    )
  }

  return CardContent
}
