'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { getCart, updateCartItem, removeFromCart } from '@/lib/cart'
import { generateCartWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    originalPrice: number | null
    image: string
    stock: number
    category: {
      name: string
    }
  }
}

export default function CartPageClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const cart = await getCart()
      if (cart) {
        setCartItems(cart)
      }
    } catch (error) {
      // Silent fail - failed to fetch cart
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setUpdating(cartItemId)
      await updateCartItem(cartItemId, newQuantity)
      
      // Update local state
      setCartItems(items => 
        items.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } catch (error: any) {
      alert(error.message || 'Failed to update quantity')
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    if (!confirm('Remove this item from cart?')) return

    try {
      setUpdating(cartItemId)
      await removeFromCart(cartItemId)
      
      // Update local state
      setCartItems(items => items.filter(item => item.id !== cartItemId))
    } catch (error: any) {
      alert(error.message || 'Failed to remove item')
    } finally {
      setUpdating(null)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = subtotal > 500000 ? 0 : 15000 // Free shipping over 500k
    return subtotal + shipping
  }

  const handleOrderWhatsApp = () => {
    const message = generateCartWhatsAppMessage(cartItems)
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({cartItems.length} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex space-x-4">
                {/* Product Image */}
                <Link href={`/products/${item.product.id}`}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600">{item.product.category.name}</p>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(item.product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating === item.id}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating === item.id}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3 py-1 border rounded text-center min-w-[50px]">
                        {updating === item.id ? '...' : item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || updating === item.id}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {item.quantity >= item.product.stock && (
                    <p className="text-sm text-red-500 mt-2">
                      Only {item.product.stock} items available
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between">
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
                <p className="text-sm text-gray-500">
                  Add {formatPrice(500000 - calculateSubtotal())} more for free shipping
                </p>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
                Proceed to Checkout
              </Button>
            </Link>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
              onClick={handleOrderWhatsApp}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Order via WhatsApp
            </Button>
            
            <Link href="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}