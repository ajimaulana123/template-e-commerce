'use client'

import Link from 'next/link'
import { X, Search as SearchIcon } from 'lucide-react'
import { useProductSearch } from './navbar/hooks/useProductSearch'

interface SearchDropdownProps {
  isOpen: boolean
  searchQuery: string
  onClose: () => void
  onSearchChange: (value: string) => void
}

export default function SearchDropdown({ isOpen, searchQuery, onClose, onSearchChange }: SearchDropdownProps) {
  const { products, loading } = useProductSearch(searchQuery, isOpen)

  const popularSearches = [
    'laptop',
    'mouse',
    'keyboard',
    'headset',
    'webcam',
    'monitor',
    'charger'
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-w-3xl">
      <div className="p-4">
        {/* Search Results */}
        {searchQuery.length >= 2 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Hasil Pencarian</h3>
              {products.length > 0 && (
                <Link 
                  href={`/products?search=${encodeURIComponent(searchQuery)}`}
                  className="text-xs text-blue-600 hover:text-blue-700"
                  onClick={onClose}
                >
                  Lihat Semua
                </Link>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-1">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-500">{product.category.name}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-sm font-semibold text-blue-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Tidak ada produk ditemukan</p>
                <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain</p>
              </div>
            )}
          </div>
        )}

        {/* Popular Searches - only show when no search query */}
        {searchQuery.length < 2 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Pencarian Populer</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => onSearchChange(term)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}