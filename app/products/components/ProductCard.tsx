import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Product } from '../types'
import { formatPrice, calculateDiscount } from '../utils/formatters'
import { useWishlist } from '../hooks/useWishlist'

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string, e: React.MouseEvent) => void
  isAddingToCart: boolean
}

export function ProductCard({ product, onAddToCart, isAddingToCart }: ProductCardProps) {
  const { inWishlist, loading: wishlistLoading, toggleWishlist } = useWishlist(product.id)

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative">
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <i className={`${inWishlist ? 'fas' : 'far'} fa-heart ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}></i>
        </button>

        <div className="relative h-48">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
          />
          {product.badge && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
              {product.badge}
            </div>
          )}
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10" style={{ marginTop: product.badge ? '32px' : '0' }}>
              -{calculateDiscount(product.price, product.originalPrice)}%
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-blue-600 font-semibold mb-1">
            {product.category.name}
          </div>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base">
            {product.name}
          </h3>
          
          {/* Rating - Always show stars */}
          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <i 
                key={i} 
                className={`fas fa-star text-xs ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              ></i>
            ))}
            {product.rating > 0 && (
              <span className="text-xs text-gray-600 ml-2">
                ({product.rating.toFixed(1)})
              </span>
            )}
          </div>
          
          <div className="space-y-1 mb-3">
            <div className="text-base lg:text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs lg:text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs lg:text-sm text-gray-600 mb-3">
            <span>
              <i className="fas fa-box mr-1"></i>
              Stock: {product.stock}
            </span>
            <span>
              <i className="fas fa-shopping-cart mr-1"></i>
              Sold: {product.sold}
            </span>
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm lg:text-base"
            onClick={(e) => onAddToCart(product.id, e)}
            disabled={isAddingToCart || product.stock === 0}
          >
            <i className="fas fa-cart-plus mr-2"></i>
            {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  )
}
