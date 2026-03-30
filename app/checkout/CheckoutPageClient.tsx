'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EmptyState } from '@/components/ui/empty-state'
import { useEnhancedToast } from '@/components/ui/enhanced-toast'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MapPin, CreditCard, Truck, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
  province: string
}

export default function CheckoutPageClient() {
  const { items: cartItems, loading } = useCart()
  const [processing, setProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const toast = useEnhancedToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 500000 ? 0 : 15000
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckout = async () => {
    // Validate form
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      toast.warning('Missing information', 'Please fill in all required shipping information')
      return
    }

    setProcessing(true)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          paymentMethod,
          subtotal: calculateSubtotal(),
          shippingCost: calculateShipping(),
          total: calculateTotal()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      toast.success('Order placed successfully!', 'Redirecting to confirmation page...')
      
      // Redirect to order confirmation page
      setTimeout(() => {
        window.location.href = `/orders/${data.order.id}/confirmation`
      }, 1000)
      
    } catch (error) {
      toast.error('Failed to place order', error instanceof Error ? error.message : 'Please try again')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products to proceed with checkout"
          action={{
            label: 'Browse Products',
            onClick: () => window.location.href = '/products',
            variant: 'primary'
          }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Progress */}
      <div className="mb-8">
        <Link href="/cart">
          <EnhancedButton 
            variant="ghost" 
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="mb-4"
          >
            Back to Cart
          </EnhancedButton>
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900">Cart</span>
          </div>
          <div className="w-16 h-0.5 bg-blue-500"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-blue-600">Checkout</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  value={shippingAddress.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="placeholder:text-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  value={shippingAddress.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="081234567890"
                  className="placeholder:text-gray-300"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Input
                  value={shippingAddress.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  placeholder="Jl. Example No. 123"
                  className="placeholder:text-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Input
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Jakarta"
                  className="placeholder:text-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input
                  value={shippingAddress.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  placeholder="12345"
                  className="placeholder:text-gray-300"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <Input
                  value={shippingAddress.province}
                  onChange={(e) => handleAddressChange('province', e.target.value)}
                  placeholder="DKI Jakarta"
                  className="placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <Truck className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Cash on Delivery (COD)</div>
                  <div className="text-sm text-gray-600">Pay when your order arrives</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  disabled
                  className="text-blue-600"
                />
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-gray-600">Coming soon</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      priority={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2 mb-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {calculateShipping() === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(calculateShipping())
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <EnhancedButton 
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCheckout}
              loading={processing}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              {processing ? 'Processing...' : `Place Order - ${formatPrice(calculateTotal())}`}
            </EnhancedButton>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}