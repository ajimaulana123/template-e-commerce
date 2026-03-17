'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, Heart, Share2, ShoppingCart, Plus, Minus } from 'lucide-react'
import { addToCart } from '@/lib/cart'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  stock: number
  sold: number
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
  const router = useRouter()

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

    fetchProduct()
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
      if (error.message === 'Unauthorized') {
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
      if (error.message === 'Unauthorized') {
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
                  <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                ))}
                <span className="text-sm text-gray-600 ml-2">5.0</span>
              </div>
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

            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
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

      {/* Related Products Section */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-box text-3xl mb-4"></i>
          <p>Related products will be shown here</p>
        </div>
      </div>
    </div>
  )
}