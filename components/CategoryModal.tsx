'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { X, Package, ArrowRight, Sparkles, Search, ChevronDown, LayoutGrid } from 'lucide-react'
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

const INITIAL_DISPLAY_COUNT = 12 
const LOAD_MORE_COUNT = 8 

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
      setSearchQuery('')
      setDisplayCount(INITIAL_DISPLAY_COUNT)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
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
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const query = searchQuery.toLowerCase()
    return categories.filter(category => 
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query)
    )
  }, [categories, searchQuery])

  const displayedCategories = useMemo(() => {
    return filteredCategories.slice(0, displayCount)
  }, [filteredCategories, displayCount])

  const hasMore = displayedCategories.length < filteredCategories.length
  const totalCount = filteredCategories.length

  const handleLoadMore = () => setDisplayCount(prev => prev + LOAD_MORE_COUNT)
  const handleCategoryClick = (slug: string) => { onClose(); router.push(`/products?category=${slug}`) }
  const handleViewAll = () => { onClose(); router.push('/products') }
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setDisplayCount(INITIAL_DISPLAY_COUNT)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        <div 
          className="bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle Mobile - Garis kecil penanda bisa di-swipe (opsional secara visual) */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

          {/* Header */}
          <div className="relative px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center ring-1 ring-emerald-100">
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">Kategori Produk</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Temukan produk halal pilihan</p>
              </div>
            </div>
            <Button 
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Section */}
          <div className="px-5 sm:px-8 pt-4 pb-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-11 bg-slate-50 border-none ring-1 ring-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl sm:rounded-2xl h-11 sm:h-12 text-sm sm:text-base transition-all"
              />
              {searchQuery && (
                <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-4 custom-scrollbar">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 bg-white flex items-center gap-3 sm:gap-4"
                  >
                    {/* Skeleton untuk Icon (Kotak di kiri) */}
                    <Skeleton className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl shrink-0 bg-slate-100" />
                    
                    {/* Skeleton untuk Teks (Tengah) */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded bg-slate-100" /> {/* Nama Kategori */}
                      <Skeleton className="h-3 w-1/3 rounded bg-slate-100" /> {/* Jumlah Produk */}
                    </div>

                    {/* Skeleton untuk Icon Panah (Kanan) */}
                    <Skeleton className="w-4 h-4 rounded-full shrink-0 bg-slate-50" />
                  </div>
                ))}
              </div>
            ) : displayedCategories.length === 0 ? (
              <div className="py-12 sm:py-20 text-center">
                 <div className="inline-flex p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
                    <Package className="w-8 h-8" />
                 </div>
                 <h3 className="text-base sm:text-lg font-bold text-slate-800">Kategori tidak ditemukan</h3>
                 <p className="text-slate-500 text-xs sm:text-sm">Coba gunakan kata kunci yang lebih umum.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {displayedCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.slug)}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={cn(
                      "group p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 text-left flex items-center gap-3 sm:gap-4 outline-none active:scale-[0.98]",
                      hoveredCategory === category.id 
                        ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/10 shadow-sm" 
                        : "border-slate-100 bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300",
                      hoveredCategory === category.id 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-50 text-slate-400 group-hover:text-emerald-500"
                    )}>
                      <i className={cn(category.icon || 'fas fa-box', "text-lg sm:text-xl")}></i>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-bold text-sm sm:text-[15px] truncate transition-colors",
                        hoveredCategory === category.id ? "text-emerald-900" : "text-slate-700"
                      )}>
                        {category.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tight">
                        {category._count?.products || 0} Produk
                      </span>
                    </div>
                    
                    <ArrowRight className={cn(
                      "w-4 h-4 transition-all shrink-0",
                      hoveredCategory === category.id ? "text-emerald-600 translate-x-1" : "text-slate-300"
                    )} />
                  </button>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-6 mb-2 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-6 border border-slate-200 text-slate-500 text-xs font-bold"
                >
                  Muat Lebih Banyak
                  <ChevronDown className="w-3 h-3 ml-1.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 bg-white sm:bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              <span className="text-[11px] font-bold text-slate-600">
                {totalCount} Total Kategori
              </span>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                onClick={onClose} 
                variant="ghost"
                className="flex-1 sm:flex-none text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
              >
                Batal
              </Button>
              <Button 
                onClick={handleViewAll}
                className="flex-1 sm:flex-none bg-slate-900 hover:bg-black text-white rounded-xl px-6 shadow-lg shadow-slate-200 text-sm"
              >
                Semua Produk
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </>
  )
}