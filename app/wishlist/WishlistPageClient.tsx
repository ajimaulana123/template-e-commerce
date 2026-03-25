'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, ShoppingBag, X, ShoppingCart, Package, TrendingUp, ArrowLeft } from 'lucide-react'
import { useWishlistManager } from '@/lib/hooks/useWishlistManager'
import { useCart } from '@/lib/hooks/useCart'

export default function WishlistPageClient() {
  const { items: wishlistItems, loading, removeFromWishlist } = useWishlistManager()
  const { addToCart } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const router = useRouter()

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId)
      await removeFromWishlist(productId)
    } catch (error: any) {
      if (error.message?.includes('Unauthorized')) {
        router.push('/login?redirect=/wishlist')
      } else {
        alert(error.message || 'Failed to remove from wishlist')
      }
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCartId(productId)
      await addToCart(productId, 1)
      await removeFromWishlist(productId)
      
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

  const calculateDiscount = (price: number, originalPrice: number | null | undefined) => {
    if (!originalPrice) return null
    const discount = ((originalPrice - price) / originalPrice) * 100
    return Math.round(discount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="w-8 h-8 mr-3 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-red-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-md transition-all relative overflow-hidden border border-gray-200">
                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={removingId === item.productId}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>

                <Link href={`/products/${item.product.id}`}>
                  <div className="relative h-48 bg-gray-50">
                    <img
                      src={item.product.images?.[0] || '/placeholder.png'}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.product.originalPrice && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{calculateDiscount(item.product.price, item.product.originalPrice)}%
                      </div>
                    )}
                  </div>
                </Link>

                <CardContent className="p-3">
                  {item.product.category && (
                    <div className="text-xs text-blue-600 font-semibold mb-1">
                      {item.product.category.name}
                    </div>
                  )}
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm hover:text-blue-600 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <div className="space-y-1 mb-3">
                    <div className="text-base font-bold text-gray-900">
                      {formatPrice(item.product.price)}
                    </div>
                    {item.product.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(item.product.originalPrice)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <span className="flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      {item.product.stock}
                    </span>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-9"
                    onClick={() => handleAddToCart(item.product.id)}
                    disabled={addingToCartId === item.product.id || item.product.stock === 0}
                  >
                    <ShoppingCart className="w-3 h-3 mr-2" />
                    {addingToCartId === item.product.id ? 'Adding...' : item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
