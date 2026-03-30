'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EmptyState } from '@/components/ui/empty-state'
import { useEnhancedToast } from '@/components/ui/enhanced-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, ShoppingBag, X, ShoppingCart, Package, ArrowLeft, Star } from 'lucide-react'
import { useWishlistManager } from '@/lib/hooks/useWishlistManager'
import { useCart } from '@/lib/hooks/useCart'
import { cn } from '@/lib/utils' // Pastikan kamu punya utility classnames

export default function WishlistPageClient() {
  const { items: wishlistItems, loading, removeFromWishlist } = useWishlistManager()
  const { addToCart } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)
  const router = useRouter()
  const toast = useEnhancedToast()

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId)
      await removeFromWishlist(productId)
      toast.success('Dihapus', 'Produk berhasil dihapus dari wishlist')
    } catch (error: any) {
      if (error.message?.includes('Unauthorized')) {
        router.push('/login?redirect=/wishlist')
      } else {
        toast.error('Gagal menghapus', error.message || 'Silakan coba lagi')
      }
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCartId(productId)
      await addToCart(productId, 1)
      await removeFromWishlist(productId)
      
      toast.success('Berhasil!', 'Produk dipindahkan ke keranjang', {
        label: 'Lihat Keranjang',
        onClick: () => router.push('/cart')
      })
    } catch (error: any) {
      toast.error('Gagal menambah ke keranjang', error.message || 'Silakan coba lagi')
    } finally {
      setAddingToCartId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateDiscount = (price: number, originalPrice: number | null | undefined) => {
    if (!originalPrice) return null
    const discount = ((originalPrice - price) / originalPrice) * 100
    return Math.round(discount)
  }

  // Loading State dengan skeleton yang lebih mirip card asli
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Skeleton className="h-10 w-64 mb-10 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden">
                <Skeleton className="w-full aspect-square" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => router.push('/')}
              className="group flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-2xl">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Wishlist Saya</h1>
                <p className="text-slate-500 font-medium">
                  {wishlistItems.length} barang tersimpan
                </p>
              </div>
            </div>
          </div>
          
          {wishlistItems.length > 0 && (
            <EnhancedButton 
              variant="outline" 
              onClick={() => router.push('/products')}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
              className="bg-white border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm"
            >
              Lanjut Belanja
            </EnhancedButton>
          )}
        </div>

        {/* Content Section */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
            <EmptyState
              icon={Heart}
              title="Wah, wishlistmu kosong"
              description="Simpan barang-barang impianmu di sini agar lebih mudah menemukannya nanti."
              action={{
                label: 'Cari Produk Sekarang',
                onClick: () => router.push('/products'),
                variant: 'primary'
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {wishlistItems.map((item) => (
              <Card 
                key={item.id} 
                className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden bg-white"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                    className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all duration-200 group/remove"
                    title="Hapus dari wishlist"
                  >
                    <X className={cn("w-4 h-4 transition-colors", removingId === item.productId ? "animate-spin" : "text-slate-600 group-hover:text-white")} />
                  </button>

                  <Link href={`/products/${item.product.id}`}>
                    <Image
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    
                    {/* Discount Badge */}
                    {item.product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider z-10 shadow-lg">
                        Hemat {calculateDiscount(item.product.price, item.product.originalPrice)}%
                      </div>
                    )}

                    {/* Low Stock Overlay */}
                    {item.product.stock > 0 && item.product.stock <= 5 && (
                      <div className="absolute bottom-0 inset-x-0 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] py-1 text-center font-bold">
                        Stok Menipis! Sisa {item.product.stock}
                      </div>
                    )}
                  </Link>
                </div>

                {/* Content Container */}
                <CardContent className="p-4">
                  <div className="mb-1 flex items-center gap-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      {item.product.category?.name || 'Produk'}
                    </span>
                  </div>
                  
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 text-sm leading-tight hover:text-blue-600 transition-colors h-10">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex flex-col mb-4">
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through decoration-red-400/50">
                        {formatPrice(item.product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <EnhancedButton 
                    variant={item.product.stock === 0 ? "secondary" : "primary"}
                    size="sm"
                    fullWidth
                    onClick={() => handleAddToCart(item.product.id)}
                    loading={addingToCartId === item.product.id}
                    disabled={item.product.stock === 0}
                    leftIcon={item.product.stock > 0 && <ShoppingCart className="w-3.5 h-3.5" />}
                    className={cn(
                      "rounded-xl font-bold transition-all",
                      item.product.stock > 0 ? "shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200" : "opacity-60"
                    )}
                  >
                    {item.product.stock === 0 ? 'Habis Terjual' : 'Beli Sekarang'}
                  </EnhancedButton>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}