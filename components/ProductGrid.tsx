import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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
}

interface ProductGridProps {
  title: string
  icon?: React.ReactNode
  products: Product[]
  columns?: number | {
    mobile: number
    tablet: number
    desktop: number
  }
  gap?: {
    mobile: number
    tablet: number
    desktop: number
  }
}

export default function ProductGrid({ 
  title, 
  icon, 
  products, 
  columns,
  gap = { mobile: 16, tablet: 20, desktop: 24 }
}: ProductGridProps) {
  // Normalize columns to responsive object for backward compatibility
  const responsiveColumns = typeof columns === 'number' 
    ? { mobile: 2, tablet: 3, desktop: columns }
    : columns || { mobile: 2, tablet: 3, desktop: 4 }

  // Build grid column classes based on responsive configuration
  const gridColsClasses = cn(
    // Mobile columns
    responsiveColumns.mobile === 1 && "grid-cols-1",
    responsiveColumns.mobile === 2 && "grid-cols-2",
    responsiveColumns.mobile === 3 && "grid-cols-3",
    // Tablet columns (md breakpoint: 768px)
    responsiveColumns.tablet === 2 && "md:grid-cols-2",
    responsiveColumns.tablet === 3 && "md:grid-cols-3",
    responsiveColumns.tablet === 4 && "md:grid-cols-4",
    // Desktop columns (lg breakpoint: 1024px)
    responsiveColumns.desktop === 2 && "lg:grid-cols-2",
    responsiveColumns.desktop === 3 && "lg:grid-cols-3",
    responsiveColumns.desktop === 4 && "lg:grid-cols-4",
    responsiveColumns.desktop === 5 && "lg:grid-cols-5",
    responsiveColumns.desktop === 6 && "lg:grid-cols-6"
  )

  // Build gap classes based on responsive configuration
  const gapClasses = cn(
    // Mobile gap (16px = gap-4)
    gap.mobile === 12 && "gap-3",
    gap.mobile === 16 && "gap-4",
    gap.mobile === 20 && "gap-5",
    // Tablet gap (20px = gap-5)
    gap.tablet === 16 && "md:gap-4",
    gap.tablet === 20 && "md:gap-5",
    gap.tablet === 24 && "md:gap-6",
    // Desktop gap (24px = gap-6)
    gap.desktop === 20 && "lg:gap-5",
    gap.desktop === 24 && "lg:gap-6",
    gap.desktop === 32 && "lg:gap-8"
  )

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <a 
          href="/products" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          aria-label={`View all ${title} products`}
        >
          Lihat Semua <i className="fas fa-chevron-right ml-1 text-xs" aria-hidden="true"></i>
        </a>
      </div>
      <div className={cn("grid", gridColsClasses, gapClasses)}>
        {products.map((product, i) => {
          const ProductCard = (
            <Card key={i} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-gray-200">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden bg-gray-50 h-48">
                  <Image 
                    src={product.images?.[0] || '/placeholder.png'} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                      {product.badge}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <CardTitle className="text-sm mb-2 line-clamp-2 h-10 text-gray-800">{product.name}</CardTitle>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }, (_, j) => (
                    <i key={j} className={`fas fa-star text-xs ${j < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                  ))}
                  {product.sold && (
                    <span className="text-xs text-gray-500 ml-2">({product.sold})</span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-base font-bold text-gray-900">{product.price}</div>
                  {product.originalPrice && (
                    <div className="text-xs text-gray-500 line-through">{product.originalPrice}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )

          // If product has ID, wrap with Link, otherwise return as is
          return product.id ? (
            <Link 
              key={i} 
              href={`/products/${product.id}`}
              aria-label={`View details for ${product.name}`}
            >
              {ProductCard}
            </Link>
          ) : ProductCard
        })}
      </div>
    </section>
  )
}
