'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { generateCartWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'

export default function CartPageClient() {
  const { items: cartItems, loading, syncing, updateQuantity, removeFromCart: removeItem, totalPrice } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = async (productId: string) => {
    if (!confirm('Remove this item from cart?')) return
    await removeItem(productId)
  }

  const calculateSubtotal = () => {
    return totalPrice
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = subtotal > 500000 ? 0 : 15000 // Free shipping over 500k
    return subtotal + shipping
  }

  const handleOrderWhatsApp = () => {
    // Convert cart items to WhatsApp format
    const whatsappItems = cartItems.map(item => ({
      quantity: item.quantity,
      product: {
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || '/placeholder.png'
      }
    }))
    
    const message = generateCartWhatsAppMessage(whatsappItems)
    openWhatsApp(message)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="flex space-x-4">
                  <Skeleton className="w-20 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link href="/products">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shopping Cart ({cartItems.length} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              {/* Mobile Layout - Vertical */}
              <div className="block sm:hidden">
                <div className="flex items-start justify-between mb-3">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 pr-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={syncing}
                    className="text-red-500 hover:text-red-700 p-1 h-auto flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-3 mb-3">
                  <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={item.product.images?.[0] || '/placeholder.png'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-2">{item.product.category?.name || 'Product'}</p>
                    <div className="mb-2">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(item.product.price)}
                      </div>
                      {item.product.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(item.product.originalPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1 || syncing}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-3 py-1 border rounded text-center min-w-[44px] text-sm font-medium">
                      {syncing ? '...' : item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock || syncing}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="font-bold text-base text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>

                {item.quantity >= item.product.stock && (
                  <p className="text-xs text-red-500 mt-2">
                    Only {item.product.stock} available
                  </p>
                )}
              </div>

              {/* Desktop Layout - Horizontal */}
              <div className="hidden sm:flex gap-4">
                <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                  <img
                    src={item.product.images?.[0] || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-semibold text-base text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 break-words">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-0.5">{item.product.category?.name || 'Product'}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={syncing}
                      className="text-red-500 hover:text-red-700 p-1 h-auto flex-shrink-0 -mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mb-2">
                    <div className="flex flex-wrap items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.product.price)}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || syncing}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-3 py-1 border rounded text-center min-w-[44px] text-sm font-medium">
                        {syncing ? '...' : item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || syncing}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500">Subtotal</p>
                      <p className="font-bold text-base text-gray-900 whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  {item.quantity >= item.product.stock && (
                    <p className="text-xs text-red-500 mt-2">
                      Only {item.product.stock} available
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm lg:sticky lg:top-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
            
            <div className="space-y-2 sm:space-y-3 mb-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {calculateSubtotal() > 500000 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(15000)
                  )}
                </span>
              </div>
              {calculateSubtotal() <= 500000 && (
                <p className="text-xs sm:text-sm text-gray-500">
                  Add {formatPrice(500000 - calculateSubtotal())} more for free shipping
                </p>
              )}
              <div className="border-t pt-2 sm:pt-3">
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2 sm:mb-3 h-10 sm:h-auto text-sm sm:text-base">
                Proceed to Checkout
              </Button>
            </Link>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white mb-2 sm:mb-3 h-10 sm:h-auto text-sm sm:text-base"
              onClick={handleOrderWhatsApp}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Order via WhatsApp
            </Button>
            
            <Link href="/products">
              <Button variant="outline" className="w-full h-10 sm:h-auto text-sm sm:text-base">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}