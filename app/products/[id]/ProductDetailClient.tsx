'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useWishlist } from '../hooks/useWishlist'
import ProductReviews from '@/components/ProductReviews'
import ReviewModal from '@/components/ReviewModal'
import ProductQuestions from '@/components/ProductQuestions'

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
      <div className="text-center py-12">
        <i className="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Product not found</h3>
        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist</p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  const productImages = getProductImages(product.images)
  const discount = calculateDiscount(product.price, product.originalPrice)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <ProductBreadcrumb 
        categoryId={product.category.id}
        categoryName={product.category.name}
        productName={product.name}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <ProductImageGallery 
          images={productImages}
          productName={product.name}
          badge={product.badge}
          discount={discount}
        />

        {/* Product Information */}
        <div className="space-y-6">
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
          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">{product.category.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Stock</span>
              <span className="font-medium">{product.stock} pieces</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sold</span>
              <span className="font-medium">{product.sold} pieces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          {existingReview ? (
            <Button
              onClick={openReviewModal}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Edit Your Review
            </Button>
          ) : canReview && reviewOrderId ? (
            <Button
              onClick={openReviewModal}
              className="bg-blue-600 hover:bg-blue-700"
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
      <div className="mt-12 pt-8 border-t">
        <ProductQuestions productId={productId} />
      </div>

      {/* Frequently Bought Together Section */}
      {frequentlyBought.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Bought Together
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {frequentlyBought.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-base font-bold text-gray-900">
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
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      {product.category.name}
                    </p>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star text-xs ${
                            i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                      {product.rating > 0 && (
                        <span className="text-xs text-gray-600 ml-1">
                          ({product.rating.toFixed(1)})
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-box text-3xl mb-4"></i>
            <p>No related products found</p>
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
  )
}
