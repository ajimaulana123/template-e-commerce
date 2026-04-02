'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from './types'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!isOpen || !product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 to-green-600">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 sm:p-2">
              <i className="fas fa-eye text-white text-base sm:text-lg"></i>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Detail Produk</h2>
              <p className="text-emerald-100 text-xs sm:text-sm hidden sm:block">Informasi lengkap produk</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Image Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg">
                    {product.badge}
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-base sm:text-lg">
                      STOK HABIS
                    </span>
                  </div>
                )}
              </div>
              
              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 2}`}
                      className="w-full h-16 sm:h-20 object-cover rounded-lg bg-gray-100 hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div>
                <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                  {product.category.name}
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{product.name}</h1>
                
                {/* Price */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-base sm:text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                        <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold">
                          -{calculateDiscount()}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock & Sales */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Stok Tersedia</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center">
                      <i className="fas fa-box mr-2 text-base sm:text-xl"></i>{product.stock}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 rounded-xl">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Terjual</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600 flex items-center">
                      <i className="fas fa-shopping-cart mr-2 text-base sm:text-xl"></i>{product.sold}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
                    <i className="fas fa-align-left text-emerald-600 mr-2 text-sm sm:text-base"></i>
                    Deskripsi
                  </h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
                  <i className="fas fa-info-circle text-emerald-600 mr-2 text-sm sm:text-base"></i>
                  Informasi Produk
                </h3>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Product ID</span>
                    <span className="font-mono text-xs text-gray-900 bg-gray-200 px-2 py-1 rounded">{product.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Dibuat</span>
                    <span className="text-xs sm:text-sm text-gray-900 text-right">{formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Terakhir Diupdate</span>
                    <span className="text-xs sm:text-sm text-gray-900 text-right">{formatDate(product.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">Status</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock > 0 ? 'Tersedia' : 'Habis'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}