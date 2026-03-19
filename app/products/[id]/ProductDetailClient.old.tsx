'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, Heart, Share2, ShoppingCart, Plus, Minus, MessageCircle } from 'lucide-react'
import { addToCart } from '@/lib/cart'
import { generateProductWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'
import { useWishlist } from '../hooks/useWishlist'
import ProductReviews from '@/components/ProductReviews'
import ReviewModal from '@/components/ReviewModal'
import ProductQuestions from '@/components/ProductQuestions'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  stock: number
  sold: number
  rating: number
  totalReviews: number
  badge: string | null
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
  }
}

interface ProductDetailClientProps {
  productId: string
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null)
  const [existingReview, setExistingReview] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)
  const router = useRouter()
  const { inWishlist, loading: wishlistLoading, toggleWishlist } = useWishlist(productId)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          // Product not found - silent fail
        }
      } catch (error) {
        // Silent fail - failed to fetch product
      } finally {
        setLoading(false)
      }
    }

    const checkReviewEligibility = async () => {
      try {
        const response = await fetch(`/api/reviews/check?productId=${productId}`)
        if (response.ok) {
          const data = await response.json()
          setCanReview(data.canReview)
          setReviewOrderId(data.orderId || null)
          setExistingReview(data.review || null)
          setCurrentUserId(data.userId || null)
        }
      } catch (error) {
        // Silent fail
      }
    }

    const fetchRelatedProducts = async () => {
      try {
        setLoadingRelated(true)
        
        // Fetch related products
        const relatedResponse = await fetch(`/api/products/${productId}/related`)
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          setRelatedProducts(relatedData)
        }

        // Fetch frequently bought together
        const frequentResponse = await fetch(`/api/products/${productId}/frequently-bought`)
        if (frequentResponse.ok) {
          const frequentData = await frequentResponse.json()
          setFrequentlyBought(frequentData)
        }
      } catch (error) {
        // Silent fail
      } finally {
        setLoadingRelated(false)
      }
    }

    fetchProduct()
    checkReviewEligibility()
    fetchRelatedProducts()
  }, [productId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateDiscount = () => {
    if (!product?.originalPrice) return null
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100
    return Math.round(discount)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      await addToCart(product.id, quantity)
      
      // Show success message or redirect to cart
      alert('Product added to cart successfully!')
      
    } catch (error: any) {
      if (error.message === 'SessionExpired') {
        alert('Your session has expired. Please login again.')
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else if (error.message === 'Unauthorized') {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        alert(error.message || 'Failed to add to cart')
      }
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      await addToCart(product.id, quantity)
      
      // Redirect to cart/checkout
      router.push('/cart')
      
    } catch (error: any) {
      if (error.message === 'SessionExpired') {
        alert('Your session has expired. Please login again.')
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else if (error.message === 'Unauthorized') {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        alert(error.message || 'Failed to add to cart')
      }
    } finally {
      setAddingToCart(false)
    }
  }

  const handleOrderWhatsApp = () => {
    if (!product) return
    const message = generateProductWhatsAppMessage(product, quantity)
    openWhatsApp(message)
  }

  const handleShare = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Check out ${product.name} - ${formatPrice(product.price)}`,
      url: window.location.href
    }

    try {
      // Check if Web Share API is supported (mostly mobile devices)
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Product link copied to clipboard!')
      }
    } catch (error: any) {
      // User cancelled share or error occurred
      if (error.name !== 'AbortError') {
        // Fallback: try to copy to clipboard
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
    return (
      <div className="space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 text-sm">
          <Skeleton className="h-4 w-16" />
          <span>/</span>
          <Skeleton className="h-4 w-20" />
          <span>/</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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

  // Mock additional images (since we only have one image in DB)
  const productImages = [product.image, product.image, product.image, product.image]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <Link href={`/products?category=${product.category.id}`} className="hover:text-blue-600">
          {product.category.name}
        </Link>
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-white rounded-lg overflow-hidden border">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {product.badge}
              </div>
            )}
            {product.originalPrice && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{calculateDiscount()}%
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Product Title & Rating */}
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{product.name}</h1>
            
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
                      -{calculateDiscount()}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-900">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-600">{product.stock} pieces available</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleBuyNow}
                disabled={addingToCart || product.stock === 0}
              >
                {addingToCart ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>

            {/* WhatsApp Order Button */}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleOrderWhatsApp}
              disabled={product.stock === 0}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Order via WhatsApp
            </Button>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex-1 ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300'}`}
                onClick={toggleWishlist}
                disabled={wishlistLoading}
              >
                <Heart className={`w-4 h-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                {wishlistLoading ? 'Loading...' : inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

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
              onClick={(e) => {
                e.preventDefault()
                console.log('Edit button clicked, existing review:', existingReview)
                setShowReviewModal(true)
              }}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Edit Your Review
            </Button>
          ) : canReview && reviewOrderId ? (
            <Button
              onClick={(e) => {
                e.preventDefault()
                console.log('Write review button clicked')
                setShowReviewModal(true)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Write a Review
            </Button>
          ) : null}
        </div>
        <ProductReviews 
          productId={productId} 
          currentUserId={currentUserId || undefined}
          onEditReview={(review) => {
            console.log('Edit from review list:', review)
            setExistingReview(review)
            setShowReviewModal(true)
          }}
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
          {loadingRelated ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {frequentlyBought.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <img
                      src={product.image}
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
          )}
        </div>
      )}

      {/* Related Products Section */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        {loadingRelated ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img
                    src={product.image}
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
          onClose={() => {
            setShowReviewModal(false)
            setExistingReview(null)
          }}
          onSuccess={() => {
            // Refresh reviews
            setShowReviewModal(false)
            setExistingReview(null)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}