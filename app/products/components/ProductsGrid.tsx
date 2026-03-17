import { Product } from '../types'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductsGridProps {
  products: Product[]
  loading: boolean
  addingToCart: string | null
  onAddToCart: (productId: string, e: React.MouseEvent) => void
}

export function ProductsGrid({ products, loading, addingToCart, onAddToCart }: ProductsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 lg:p-12 text-center">
        <i className="fas fa-search text-3xl lg:text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-500 text-sm lg:text-base">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isAddingToCart={addingToCart === product.id}
        />
      ))}
    </div>
  )
}
