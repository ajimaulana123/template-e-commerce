import Link from 'next/link'
import Image from 'next/image'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { useEnhancedToast } from '@/components/ui/enhanced-toast'
import { Product } from '../types'
import { formatPrice, calculateDiscount } from '../utils/formatters'
import { useWishlist } from '../hooks/useWishlist'
import { ShoppingCart, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string, e: React.MouseEvent) => void
  isAddingToCart: boolean
}

export function ProductCard({ product, onAddToCart, isAddingToCart }: ProductCardProps) {
  const { inWishlist, loading: wishlistLoading, toggleWishlist } = useWishlist(product.id)
  const toast = useEnhancedToast()
  const router = useRouter()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await onAddToCart(product.id, e)
      toast.success(
        'Added to cart!',
        `${product.name} has been added to your cart`,
        {
          label: 'View Cart',
          onClick: () => router.push('/cart')
        }
      )
    } catch (error) {
      toast.error('Failed to add to cart', 'Please try again')
    }
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await toggleWishlist(e)
      if (inWishlist) {
        toast.info('Removed from wishlist', `${product.name} removed from your wishlist`)
      } else {
        toast.success('Added to wishlist!', `${product.name} saved to your wishlist`)
      }
    } catch (error) {
      toast.error('Failed to update wishlist', 'Please try again')
    }
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
        {/* Wishlist Button - Enhanced */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 disabled:opacity-50"
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Product Image with Hover Effect */}
        <div className="relative h-48 overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.badge && (
              <div className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold shadow-md">
                {product.badge}
              </div>
            )}
            {product.originalPrice && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-bold shadow-md">
                -{calculateDiscount(product.price, product.originalPrice)}% OFF
              </div>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold shadow-md">
              Only {product.stock} left!
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
            {product.category.name}
          </div>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <i 
                  key={i} 
                  className={`fas fa-star text-xs ${
                    i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            {product.rating > 0 && (
              <span className="text-xs text-gray-600 ml-2 font-medium">
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>
          
          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <div className="text-lg lg:text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
          </div>

          {/* Stock & Sold Info */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1">
              <i className="fas fa-box"></i>
              <span className="font-medium">{product.stock}</span> in stock
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-fire text-orange-500"></i>
              <span className="font-medium">{product.sold}</span> sold
            </span>
          </div>

          {/* Add to Cart Button - Enhanced */}
          <EnhancedButton
            variant="primary"
            size="md"
            fullWidth
            loading={isAddingToCart}
            disabled={product.stock === 0}
            leftIcon={<ShoppingCart className="h-4 w-4" />}
            onClick={handleAddToCart}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </EnhancedButton>
        </div>
      </div>
    </Link>
  )
}
