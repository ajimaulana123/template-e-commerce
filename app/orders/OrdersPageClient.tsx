'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, ShoppingBag, Eye, X } from 'lucide-react'

interface OrderItem {
  id: string
  productName: string
  productImage: string
  price: number
  quantity: number
  subtotal: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  paymentStatus: string
  total: number
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPageClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh orders
        fetchOrders()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to cancel order')
      }
    } catch (error) {
      alert('Failed to cancel order')
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
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className={filter === status ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {status === 'all' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === 'all' ? 'No Orders Yet' : `No ${filter.toLowerCase()} orders`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "Start shopping to see your orders here" 
                : `You don't have any ${filter.toLowerCase()} orders`}
            </p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-600">
                      +{order.items.length - 2} more item(s)
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/orders/${order.id}/confirmation`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {order.status === 'PENDING' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
