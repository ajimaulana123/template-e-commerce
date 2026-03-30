'use client'

import Link from 'next/link'
import Image from 'next/image'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EmptyState } from '@/components/ui/empty-state'
import { useEnhancedToast } from '@/components/ui/enhanced-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Minus, Trash2, ShoppingBag, MessageCircle, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/hooks/useCart'
import { generateCartWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'
import { useRouter } from 'next/navigation'

export default function CartPageClient() {
  const { items: cartItems, loading, syncing, updateQuantity, removeFromCart: removeItem, totalPrice } = useCart()
  const toast = useEnhancedToast()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateQuantity(productId, newQuantity)
      toast.success('Cart updated', 'Quantity has been updated')
    } catch (error) {
      toast.error('Failed to update quantity', 'Please try again')
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId)
      toast.success('Item removed', 'Product has been removed from your cart')
    } catch (error) {
      toast.error('Failed to remove item', 'Please try again')
    }
  }

  const calculateSubtotal = () => {
    return totalPrice
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = subtotal > 500000 ? 0 : 15000 // Free shipping over 500k
    return subtotal + shipping
  }

  const handleOrderWhatsApp = () => {
    // Convert cart items to WhatsApp format
    const whatsappItems = cartItems.map(item => ({
      quantity: item.quantity,
      product: {
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || '/placeholder.svg'
      }
    }))
    
    const message = generateCartWhatsAppMessage(whatsappItems)
    openWhatsApp(message)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="flex space-x-4">
                  <Skeleton className="w-20 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Start shopping to add items to your cart and enjoy our products"
        action={{
          label: 'Browse Products',
          onClick: () => router.push('/products'),
          variant: 'primary'
        }}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header dengan Glassmorphism effect */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Anda memiliki <span className="font-semibold text-emerald-600">{cartItems.length} produk</span> di keranjang
          </p>
        </div>
        <EnhancedButton 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/products')}
          className="text-emerald-600 hover:bg-emerald-50 font-medium hidden sm:flex"
        >
          Lanjut Belanja
        </EnhancedButton>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* List Produk (Lef Side) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Dekorasi Hover */}
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex gap-4 sm:gap-6">
                {/* Image Section */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  <Image
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-4">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                        {item.product.category?.name || 'Katalog'}
                      </p>
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-bold text-base sm:text-lg text-slate-800 hover:text-emerald-600 transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(item.product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls - Repositioned for better UX */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || syncing}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-emerald-600 disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-slate-800">
                        {syncing ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock || syncing}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-emerald-600 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Subtotal</p>
                      <p className="font-bold text-emerald-600 text-base">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (Right Side) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-slate-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              Ringkasan Pesanan
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal Produk</span>
                <span className="text-white font-semibold">{formatPrice(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Biaya Pengiriman</span>
                <span className="text-white font-semibold">
                  {calculateSubtotal() > 500000 ? (
                    <span className="text-emerald-400 uppercase text-xs font-bold tracking-widest">Gratis</span>
                  ) : (
                    formatPrice(15000)
                  )}
                </span>
              </div>
              
              {calculateSubtotal() <= 500000 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <p className="text-[11px] text-emerald-400 leading-snug">
                    Beli <span className="font-bold">{formatPrice(500000 - calculateSubtotal())}</span> lagi untuk mendapatkan <span className="font-bold italic">Gratis Ongkir!</span>
                  </p>
                </div>
              )}

              <div className="h-px bg-slate-800 my-4" />
              
              <div className="flex justify-between items-end pb-6">
                <span className="text-slate-400 text-sm">Total Pembayaran</span>
                <span className="text-2xl font-black text-emerald-400 tracking-tight">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <EnhancedButton 
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => router.push('/checkout')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-6 font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                Checkout Sekarang
              </EnhancedButton>

              <EnhancedButton 
                variant="outline"
                fullWidth
                size="lg"
                onClick={handleOrderWhatsApp}
                className="bg-transparent border-slate-700 hover:bg-slate-800 text-white rounded-xl py-6 font-semibold"
                leftIcon={<MessageCircle className="w-5 h-5 text-emerald-500" />}
              >
                Order via WhatsApp
              </EnhancedButton>
            </div>
            
            <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest font-medium">
              Sistem Pembayaran Terenkripsi & Aman
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}