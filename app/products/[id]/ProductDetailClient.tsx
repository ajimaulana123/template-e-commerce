'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useWishlist } from '../hooks/useWishlist'

// Lazy load below-the-fold components
const ProductReviews = dynamic(() => import('@/components/ProductReviews'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
})

const ProductQuestions = dynamic(() => import('@/components/ProductQuestions'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
})

// Lazy load ReviewModal - only loads when user wants to write review
const ReviewModal = dynamic(() => import('@/components/ReviewModal'), {
  ssr: false
})

// Hooks
import { useProductDetail } from './hooks/useProductDetail'
import { useProductReview } from './hooks/useProductReview'
import { useProductActions } from './hooks/useProductActions'

// Components
import { ProductBreadcrumb } from './components/ProductBreadcrumb'
import { ProductImageGallery } from './components/ProductImageGallery'
import { ProductInfo } from './components/ProductInfo'
import { ProductQuantitySelector } from './components/ProductQuantitySelector'
import { ProductActions } from './components/ProductActions'
import { ProductDetailSkeleton } from './components/ProductDetailSkeleton'

// Utils
import { formatPrice, calculateDiscount, getProductImages } from './utils/productHelpers'

interface ProductDetailClientProps {
  productId: string
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter()
  
  // Custom hooks
  const { product, loading, relatedProducts, frequentlyBought, loadingRelated } = useProductDetail(productId)
  const { 
    canReview, 
    reviewOrderId, 
    existingReview, 
    currentUserId, 
    showReviewModal,
    openReviewModal,
    closeReviewModal,
    handleEditReview
  } = useProductReview(productId)
  const { 
    quantity, 
    addingToCart, 
    handleQuantityChange, 
    handleAddToCart, 
    handleBuyNow 
  } = useProductActions(productId)
  const { inWishlist, loading: wishlistLoading, toggleWishlist } = useWishlist(productId)

  const handleShare = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - ${formatPrice(product.price)}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Product link copied to clipboard!')
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href)
          alert('Product link copied to clipboard!')
        } catch (clipboardError) {
          alert('Failed to share product')
        }
      }
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12 px-4">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h3>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist</p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const productImages = getProductImages(product.images)
  const discount = calculateDiscount(product.price, product.originalPrice)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" size="sm" className="mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="space-y-4 sm:space-y-6">
          {/* Breadcrumb */}
          <ProductBreadcrumb 
            categoryId={product.category.id}
            categoryName={product.category.name}
            productName={product.name}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Product Images */}
            <ProductImageGallery 
              images={productImages}
              productName={product.name}
              badge={product.badge}
              discount={discount}
            />

            {/* Product Information */}
            <div className="space-y-4 sm:space-y-6">
              <ProductInfo product={product} />

              {/* Quantity Selector */}
              <ProductQuantitySelector 
                quantity={quantity}
                stock={product.stock}
                onQuantityChange={(change) => handleQuantityChange(change, product.stock)}
              />

              {/* Action Buttons */}
              <ProductActions 
                product={product}
                quantity={quantity}
                addingToCart={addingToCart}
                inWishlist={inWishlist}
                wishlistLoading={wishlistLoading}
                onAddToCart={() => handleAddToCart(product.id)}
                onBuyNow={() => handleBuyNow(product.id)}
                onToggleWishlist={toggleWishlist}
                onShare={handleShare}
              />

              {/* Product Info */}
              <div className="border-t pt-4 sm:pt-6 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Stock</span>
                  <span className="font-medium">{product.stock} pieces</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Sold</span>
                  <span className="font-medium">{product.sold} pieces</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Reviews</h2>
              {existingReview ? (
                <Button
                  onClick={openReviewModal}
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                >
                  Edit Your Review
                </Button>
              ) : canReview && reviewOrderId ? (
                <Button
                  onClick={openReviewModal}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  Write a Review
                </Button>
              ) : null}
            </div>
            <ProductReviews 
              productId={productId} 
              currentUserId={currentUserId || undefined}
              onEditReview={handleEditReview}
            />
          </div>

          {/* Product Questions Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
            <ProductQuestions productId={productId} />
          </div>

          {/* Frequently Bought Together Section */}
          {frequentlyBought.length > 0 && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Frequently Bought Together
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                {frequentlyBought.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                      <div className="relative h-32 sm:h-48 bg-gray-50">
                        <img
                          src={product.images[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 sm:p-3">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1 sm:mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm sm:text-base font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Products Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Related Products</h2>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {relatedProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                      <div className="relative h-32 sm:h-48 bg-gray-50">
                        <img
                          src={product.images[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 sm:p-3">
                        <p className="text-[10px] sm:text-xs text-blue-600 font-semibold mb-1">
                          {product.category.name}
                        </p>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1 sm:mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center mb-1 sm:mb-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-star text-[10px] sm:text-xs ${
                                i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                          {product.rating > 0 && (
                            <span className="text-[10px] sm:text-xs text-gray-600 ml-1">
                              ({product.rating.toFixed(1)})
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 sm:p-12 text-center border border-gray-200">
                <i className="fas fa-box text-3xl sm:text-4xl text-gray-300 mb-3 sm:mb-4"></i>
                <p className="text-sm sm:text-base text-gray-500">No related products found</p>
              </div>
            )}
          </div>

          {/* Review Modal */}
          {showReviewModal && product && (reviewOrderId || existingReview) && (
            <ReviewModal
              productId={productId}
              productName={product.name}
              orderId={reviewOrderId || existingReview?.orderId || ''}
              existingReview={existingReview}
              onClose={closeReviewModal}
              onSuccess={() => {
                closeReviewModal()
                window.location.reload()
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
