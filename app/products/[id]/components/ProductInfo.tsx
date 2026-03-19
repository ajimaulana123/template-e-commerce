import { formatPrice, calculateDiscount } from '../utils/productHelpers'

interface Product {
  name: string
  rating: number
  totalReviews: number
  sold: number
  stock: number
  price: number
  originalPrice: number | null
  description: string | null
}

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const discount = calculateDiscount(product.price, product.originalPrice)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>
      
      {/* Rating & Stats */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <i 
              key={i} 
              className={`fas fa-star text-sm ${
                i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            ></i>
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {product.rating > 0 ? product.rating.toFixed(1) : 'No rating'}
          </span>
        </div>
        {product.totalReviews > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{product.totalReviews}</span> {product.totalReviews === 1 ? 'Review' : 'Reviews'}
          </div>
        )}
        <div className="text-sm text-gray-600">
          <span className="font-medium">{product.sold}</span> Sold
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{product.stock}</span> In Stock
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-red-500">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Description</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}
    </div>
  )
}
