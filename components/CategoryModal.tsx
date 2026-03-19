'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { X, Grid3X3, Package, ArrowRight, Sparkles, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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

const INITIAL_DISPLAY_COUNT = 12 // Show 12 categories initially
const LOAD_MORE_COUNT = 8 // Load 8 more each time

export default function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      // Reset states when modal opens
      setSearchQuery('')
      setDisplayCount(INITIAL_DISPLAY_COUNT)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      // Silent fail - failed to fetch categories
    } finally {
      setLoading(false)
    }
  }

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    
    const query = searchQuery.toLowerCase()
    return categories.filter(category => 
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query)
    )
  }, [categories, searchQuery])

  // Categories to display (with pagination)
  const displayedCategories = useMemo(() => {
    return filteredCategories.slice(0, displayCount)
  }, [filteredCategories, displayCount])

  const hasMore = displayedCategories.length < filteredCategories.length
  const totalCount = filteredCategories.length

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_COUNT)
  }

  const handleCategoryClick = (slug: string) => {
    onClose()
    router.push(`/products?category=${slug}`)
  }

  const handleViewAll = () => {
    onClose()
    router.push('/products')
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    // Reset display count when searching
    setDisplayCount(INITIAL_DISPLAY_COUNT)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-24 lg:pt-28 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[85vh] overflow-hidden pointer-events-auto animate-in slide-in-from-top-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Grid3X3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Kategori Produk</h2>
                  <p className="text-sm text-gray-600">Pilih kategori untuk melihat produk halal</p>
                </div>
              </div>
              <Button 
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {loading ? (
            /* Loading State */
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3 border-2 border-gray-200 rounded-xl bg-white">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center justify-between pt-1">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : categories.length === 0 ? (
            /* Empty State */
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Kategori</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Kategori produk akan muncul di sini setelah ditambahkan oleh admin
              </p>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="px-6 pt-6 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Cari kategori..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 bg-gray-50 border-gray-300 text-sm focus:border-green-500 focus:ring-green-500 rounded-lg h-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Results count */}
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-2">
                    {totalCount === 0 ? 'Tidak ada hasil' : `Ditemukan ${totalCount} kategori`}
                  </p>
                )}
              </div>

              {/* Categories Grid */}
              <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-280px)]">
                {displayedCategories.length === 0 ? (
                  /* No Search Results */
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Kategori tidak ditemukan</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                      Coba kata kunci lain atau lihat semua produk
                    </p>
                    <Button 
                      onClick={() => handleSearchChange('')}
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                    >
                      Reset Pencarian
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {displayedCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryClick(category.slug)}
                          onMouseEnter={() => setHoveredCategory(category.id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          className={cn(
                            "group relative p-5 rounded-xl border-2 transition-all duration-300",
                            "hover:border-green-500 hover:shadow-lg hover:scale-105",
                            "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                            hoveredCategory === category.id
                              ? "border-green-500 bg-green-50 shadow-lg scale-105"
                              : "border-gray-200 bg-white hover:bg-green-50"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-300",
                            hoveredCategory === category.id
                              ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
                              : "bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-500 group-hover:to-emerald-600"
                          )}>
                            <i className={cn(
                              category.icon || 'fas fa-box',
                              "text-2xl transition-colors duration-300",
                              hoveredCategory === category.id
                                ? "text-white"
                                : "text-green-600 group-hover:text-white"
                            )}></i>
                          </div>

                          {/* Category Name */}
                          <h3 className={cn(
                            "font-semibold text-left mb-2 transition-colors duration-300 line-clamp-2",
                            hoveredCategory === category.id
                              ? "text-green-700"
                              : "text-gray-900 group-hover:text-green-700"
                          )}>
                            {category.name}
                          </h3>

                          {/* Product Count */}
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs transition-colors duration-300",
                                hoveredCategory === category.id
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-700"
                              )}
                            >
                              {category._count?.products || 0} produk
                            </Badge>
                            
                            <ArrowRight className={cn(
                              "w-4 h-4 transition-all duration-300",
                              hoveredCategory === category.id
                                ? "text-green-600 translate-x-1"
                                : "text-gray-400 group-hover:text-green-600 group-hover:translate-x-1"
                            )} />
                          </div>

                          {/* Hover Effect Overlay */}
                          {hoveredCategory === category.id && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 pointer-events-none" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                      <div className="mt-6 text-center">
                        <Button
                          onClick={handleLoadMore}
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Muat {Math.min(LOAD_MORE_COUNT, filteredCategories.length - displayCount)} Kategori Lagi
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Menampilkan {displayedCategories.length} dari {totalCount} kategori
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{totalCount} kategori {searchQuery ? 'ditemukan' : 'tersedia'}</span>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={onClose} 
                    variant="outline"
                    className="flex-1 sm:flex-none border-gray-300 hover:bg-gray-100"
                  >
                    Tutup
                  </Button>
                  <Button 
                    onClick={handleViewAll}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Lihat Semua Produk
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}