'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react'

export default function OrdersPageClient() {
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

      {/* Coming Soon Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-5 h-5" />
          <h3 className="font-semibold">Order History</h3>
        </div>
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Order History Coming Soon</h3>
          <p className="text-gray-500 mb-6">
            We're working on building a comprehensive order tracking system for you.
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>• View your order history</p>
            <p>• Track order status</p>
            <p>• Download invoices</p>
            <p>• Reorder previous items</p>
          </div>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}