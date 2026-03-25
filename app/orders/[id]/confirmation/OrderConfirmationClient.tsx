'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, Package, MapPin, CreditCard, Clock } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  paymentStatus: string
  subtotal: number
  shippingCost: number
  total: number
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string | null
  province: string | null
  createdAt: string
  items: Array<{
    id: string
    productName: string
    productImage: string
    price: number
    quantity: number
    subtotal: number
  }>
}

export default function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }

      const data = await response.json()
      setOrder(data)
    } catch (err) {
      setError('Failed to load order details')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist'}</p>
        <Link href="/orders">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            View All Orders
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <div className="inline-block bg-white px-4 py-2 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Order Number</p>
          <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Status */}
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-gray-900 capitalize">{order.status.toLowerCase()}</p>
              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium text-gray-900">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {order.paymentStatus.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="border-t pt-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
              <p className="font-medium text-gray-900">{order.fullName}</p>
              <p className="text-sm text-gray-600">{order.phone}</p>
              <p className="text-sm text-gray-600">{order.address}</p>
              <p className="text-sm text-gray-600">
                {order.city}
                {order.postalCode && `, ${order.postalCode}`}
                {order.province && `, ${order.province}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Items Ordered</h2>
        </div>
        
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex space-x-4 pb-4 border-b last:border-b-0">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.productName}</h3>
                <p className="text-sm text-gray-600">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatPrice(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-6 pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {order.shippingCost === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(order.shippingCost)
              )}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/orders" className="flex-1">
          <Button variant="outline" className="w-full">
            View All Orders
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
