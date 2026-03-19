'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from './types'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onEdit: (product: Product) => void
}

export default function ProductDetailModal({ product, isOpen, onClose, onEdit }: ProductDetailModalProps) {
  if (!isOpen || !product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateDiscount = () => {
    if (!product.originalPrice) return null
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100
    return Math.round(discount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <i className="fas fa-eye text-blue-500"></i>
            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg border"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.badge}
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <div className="text-sm text-blue-600 font-semibold mb-2">{product.category.name}</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
                
                {/* Price */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
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

                {/* Stock & Sales */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Stock Available</div>
                    <div className="text-xl font-bold text-blue-600">
                      <i className="fas fa-box mr-2"></i>{product.stock}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Total Sold</div>
                    <div className="text-xl font-bold text-green-600">
                      <i className="fas fa-shopping-cart mr-2"></i>{product.sold}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Product ID</span>
                    <span className="font-mono text-sm text-gray-900">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Created</span>
                    <span className="text-gray-900">{formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900">{formatDate(product.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button onClick={() => onEdit(product)} className="bg-blue-600 hover:bg-blue-700">
            <i className="fas fa-edit mr-2"></i>Edit Product
          </Button>
        </div>
      </div>
    </div>
  )
}