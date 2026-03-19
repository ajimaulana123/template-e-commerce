'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getWishlist, removeFromWishlist } from '@/lib/wishlist'
import { addToCart } from '@/lib/cart'

interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  product: {
    id: string
    name: string
    description: string | null
    price: number
    originalPrice: number | null
    image: string
    stock: number
    sold: number
    badge: string | null
    category: {
      id: string
      name: string
    }
  }
}

export default function WishlistPageClient() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const data = await getWishlist()
      setWishlistItems(data)
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        router.push('/login?redirect=/wishlist')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (wishlistItemId: string) => {
    try {
      setRemovingId(wishlistItemId)
      await removeFromWishlist(wishlistItemId)
      setWishlistItems(items => items.filter(item => item.id !== wishlistItemId))
      
      // Trigger wishlist count update
      window.dispatchEvent(new CustomEvent('wishlistChanged'))
    } catch (error: any) {
      alert(error.message || 'Failed to remove from wishlist')
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (productId: string, wishlistItemId: string) => {
    try {
      setAddingToCartId(productId)
      await addToCart(productId, 1)
      await removeFromWishlist(wishlistItemId)
      setWishlistItems(items => items.filter(item => item.id !== wishlistItemId))
      
      // Trigger wishlist count update
      window.dispatchEvent(new CustomEvent('wishlistChanged'))
      alert('Product moved to cart!')
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart')
    } finally {
      setAddingToCartId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateDiscount = (price: number, originalPrice: number | null) => {
    if (!originalPrice) return null
    const discount = ((originalPrice - price) / originalPrice) * 100
    return Math.round(discount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative top-10 sm:top-0">
      <div className="bg-white rounded-lg p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
              <i className="far fa-heart mr-2 text-red-500"></i>
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <i className="fas fa-shopping-bag mr-2"></i>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <i className="far fa-heart text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save items you love to buy them later</p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <i className="fas fa-shopping-bag mr-2"></i>
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
              <button
                onClick={() => handleRemove(item.id)}
                disabled={removingId === item.id}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
              >
                <i className="fas fa-times text-red-500"></i>
              </button>

              <Link href={`/products/${item.product.id}`}>
                <div className="relative h-48">
                  <img
                    src={item.product.images?.[0] || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                  {item.product.badge && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {item.product.badge}
                    </div>
                  )}
                  {item.product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold" style={{ marginTop: item.product.badge ? '32px' : '0' }}>
                      -{calculateDiscount(item.product.price, item.product.originalPrice)}%
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  {item.product.category.name}
                </div>
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base hover:text-blue-600">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="space-y-1 mb-3">
                  <div className="text-base lg:text-lg font-bold text-gray-900">
                    {formatPrice(item.product.price)}
                  </div>
                  {item.product.originalPrice && (
                    <div className="text-xs lg:text-sm text-gray-500 line-through">
                      {formatPrice(item.product.originalPrice)}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <span>
                    <i className="fas fa-box mr-1"></i>
                    Stock: {item.product.stock}
                  </span>
                  <span>
                    <i className="fas fa-shopping-cart mr-1"></i>
                    Sold: {item.product.sold}
                  </span>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                  onClick={() => handleAddToCart(item.product.id, item.id)}
                  disabled={addingToCartId === item.product.id || item.product.stock === 0}
                >
                  <i className="fas fa-cart-plus mr-2"></i>
                  {addingToCartId === item.product.id ? 'Adding...' : item.product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
