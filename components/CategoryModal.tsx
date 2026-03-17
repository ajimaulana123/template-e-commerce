'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface Category {
  id: string
  name: string
  icon: string | null
  slug: string
  _count?: {
    products: number
  }
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        if (data.length > 0) {
          setActiveTab(data[0].id)
        }
      }
    } catch (error) {
      // Silent fail - failed to fetch categories
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-32 md:pt-28 lg:pt-32 xl:pt-36 2xl:pt-40">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            <i className="fas fa-th text-orange-500"></i>
            <h2 className="text-xl font-bold text-gray-900">Kategori</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          /* Loading State */
          <div className="p-6">
            {/* Tabs Skeleton */}
            <div className="flex border-b overflow-x-auto mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-6 py-3 border-b-2 border-transparent">
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center">
            <i className="fas fa-th text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories available</h3>
            <p className="text-gray-500">Categories will appear here once they are added by admin</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 flex items-center space-x-2",
                    activeTab === category.id
                      ? "text-orange-500 border-orange-500"
                      : "text-gray-600 border-transparent hover:text-gray-900"
                  )}
                >
                  <i className={`${category.icon || 'fas fa-th'}`}></i>
                  <span>{category.name}</span>
                  {category._count && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {category._count.products}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {categories.find(cat => cat.id === activeTab) ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${categories.find(cat => cat.id === activeTab)?.icon || 'fas fa-th'} text-2xl text-orange-500`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {categories.find(cat => cat.id === activeTab)?.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {categories.find(cat => cat.id === activeTab)?._count?.products || 0} products available
                  </p>
                  <Button 
                    onClick={() => {
                      const category = categories.find(cat => cat.id === activeTab)
                      if (category) {
                        onClose()
                        // Use client-side navigation without page refresh
                        window.history.pushState({}, '', `/products?category=${category.slug}`)
                        // Trigger a custom event to notify ProductsPageClient
                        window.dispatchEvent(new CustomEvent('categoryChange', { 
                          detail: { category, slug: category.slug } 
                        }))
                      }
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <i className="fas fa-arrow-right mr-2"></i>
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-box-open text-4xl mb-4"></i>
                  <p>Select a category to view details</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <Button onClick={onClose} variant="outline">
            Tutup
          </Button>
          <Button 
            onClick={() => {
              onClose()
              // Use client-side navigation without page refresh
              window.history.pushState({}, '', '/products')
              // Trigger a custom event to notify ProductsPageClient
              window.dispatchEvent(new CustomEvent('categoryChange', { 
                detail: { category: null, slug: null } 
              }))
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <i className="fas fa-th-large mr-2"></i>
            View All Products
          </Button>
        </div>
      </div>
    </div>
  )
}