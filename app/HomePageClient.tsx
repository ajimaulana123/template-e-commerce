'use client'

import { useEffect, useState, useMemo } from 'react'
import CategoryIcons from '@/components/CategoryIcons'
import ProductGrid from '@/components/ProductGrid'
import CategoryIconsSkeleton from '@/components/skeletons/CategoryIconsSkeleton'
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton'
import FlashSaleSection from '@/app/homepage/components/FlashSaleSection'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Award, Truck, Headset, RefreshCcw, Flame, Sparkles, Lightbulb } from 'lucide-react'
import { useScrollReveal, useStaggeredScrollReveal } from '@/app/homepage/hooks'

interface Category {
  id: string
  name: string
  icon: string | null
  slug: string
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  images?: string[]
  stock: number
  sold: number
  rating: number
  badge: string | null
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
  }
}

export default function HomePageClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Scroll reveal animations for sections
  const categorySection = useScrollReveal<HTMLElement>({ delay: 100 })
  const flashSaleSection = useScrollReveal<HTMLElement>({ delay: 150 })
  const popularSection = useScrollReveal<HTMLElement>({ delay: 200 })
  const ctaSection = useScrollReveal<HTMLElement>({ delay: 150 })
  const newProductsSection = useScrollReveal<HTMLDivElement>({ delay: 200 })
  const recommendedSection = useScrollReveal<HTMLDivElement>({ delay: 200 })
  const featuresSection = useScrollReveal<HTMLElement>({ delay: 150 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?limit=100')
        ])

        if (catRes.ok) setCategories(await catRes.json())
        if (prodRes.ok) {
          const data = await prodRes.json()
          setProducts(Array.isArray(data) ? data : data.products || [])
        }
      } catch (error) {
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatProductForGrid = (product: Product) => {
    const formatIDR = (price: number) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

    return {
      id: product.id,
      name: product.name,
      price: formatIDR(product.price),
      originalPrice: product.originalPrice ? formatIDR(product.originalPrice) : undefined,
      images: product.images?.length ? product.images : [product.image || '/placeholder.png'],
      rating: Math.round(product.rating),
      sold: product.sold.toString(),
      badge: product.badge || undefined
    }
  }

  // Memoize sections agar tidak re-render berat
  const sections = useMemo(() => {
    return {
      flashSale: products.filter(p => p.badge && p.originalPrice).slice(0, 6).map(formatProductForGrid),
      popular: [...products].sort((a, b) => b.sold - a.sold).slice(0, 8).map(formatProductForGrid),
      new: [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6).map(formatProductForGrid),
      recommended: products.filter(p => p.stock > 0).slice(0, 12).map(formatProductForGrid)
    }
  }, [products])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <h1 className="sr-only">Halal Mart - Belanja Produk Halal Terpercaya</h1>

      {/* Main content landmark */}
      <main id="main-content">
        {/* 1. Category Section: Diberi background subtle agar terpisah dari Hero */}
        <section
          ref={categorySection.ref}
          className={`py-10 bg-white border-b border-slate-100 mb-8 ${categorySection.animationClasses}`}
          aria-label="Product Categories"
        >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Kategori Pilihan
            </h2>
          </div>
          {loading ? <CategoryIconsSkeleton /> : <CategoryIcons categories={categories} />}
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16">
        {loading ? (
          <div className="space-y-12">
            <ProductCardSkeleton columns={6} />
            <ProductCardSkeleton columns={4} />
          </div>
        ) : (
          <>
            {/* 2. Flash Sale: Menghilangkan border kaku, ganti dengan shadow/glow */}
            {sections.flashSale.length > 0 && (
              <section
                ref={flashSaleSection.ref}
                className={`relative overflow-hidden rounded-3xl bg-white p-1 shadow-sm border border-slate-100 ${flashSaleSection.animationClasses}`}
              >
                <FlashSaleSection products={sections.flashSale} maxProducts={6} />
              </section>
            )}

            {/* 3. Popular Products: Menggunakan Grid yang lebih bersih */}
            {sections.popular.length > 0 && (
              <section
                ref={popularSection.ref}
                className={popularSection.animationClasses}
              >
                <ProductGrid
                  title="Produk Terpopuler"
                  icon={<Flame className="w-5 h-5 text-red-600" aria-hidden="true" />}
                  products={sections.popular}
                  columns={4}
                />
              </section>
            )}

            {/* 4. CTA App Download: Dibuat lebih modern & tidak kaku */}
            <section
              ref={ctaSection.ref}
              className={`relative overflow-hidden rounded-3xl bg-emerald-900 py-12 px-8 text-white ${ctaSection.animationClasses}`}
            >
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-extrabold mb-3">Belanja Lebih Hemat di Aplikasi</h2>
                  <p className="text-emerald-100/80 max-w-md">Dapatkan promo eksklusif, tracking pesanan real-time, dan gratis ongkir khusus pengguna baru.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    variant="secondary" 
                    className="bg-white text-emerald-900 hover:bg-emerald-50 h-14 px-8 rounded-xl font-bold animate-cta-pulse"
                    aria-label="Download Halal Mart app from App Store"
                  >
                    App Store
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 h-14 px-8 rounded-xl font-bold"
                    aria-label="Download Halal Mart app from Google Play"
                  >
                    Google Play
                  </Button>
                </div>
              </div>
            </section>

            {/* 5. New & Recommended: Tanpa separator garis (HR), ganti dengan spacing */}
            <div className="grid grid-cols-1 gap-16">
              {sections.new.length > 0 && (
                <div
                  ref={newProductsSection.ref}
                  className={newProductsSection.animationClasses}
                >
                  <ProductGrid
                    title="Produk Terbaru"
                    icon={<Sparkles className="w-5 h-5 text-blue-600" aria-hidden="true" />}
                    products={sections.new}
                    columns={6}
                  />
                </div>
              )}

              {sections.recommended.length > 0 && (
                <div
                  ref={recommendedSection.ref}
                  className={recommendedSection.animationClasses}
                >
                  <ProductGrid
                    title="Rekomendasi Untuk Anda"
                    icon={<Lightbulb className="w-5 h-5 text-yellow-600" aria-hidden="true" />}
                    products={sections.recommended}
                    columns={6}
                  />
                </div>
              )}
            </div>

            {/* 6. Features: Dibuat Card-based agar lebih clean */}
            <section
              ref={featuresSection.ref}
              className={`grid grid-cols-2 lg:grid-cols-4 gap-6 py-12 ${featuresSection.animationClasses}`}
            >
              {[
                { icon: Truck, title: "Gratis Ongkir", desc: "Min. belanja Rp500rb", color: "text-blue-600", bg: "bg-blue-50", shadow: "hover:shadow-blue-100" },
                { icon: Award, title: "Garansi Resmi", desc: "100% Produk Original", color: "text-emerald-600", bg: "bg-emerald-50", shadow: "hover:shadow-emerald-100" },
                { icon: Headset, title: "24/7 Support", desc: "Bantuan kapan saja", color: "text-orange-600", bg: "bg-orange-50", shadow: "hover:shadow-orange-100" },
                { icon: RefreshCcw, title: "Easy Return", desc: "7 Hari pengembalian", color: "text-purple-600", bg: "bg-purple-50", shadow: "hover:shadow-purple-100" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`group relative flex flex-col items-center p-8 bg-white rounded-[2rem] border border-slate-50 text-center 
                 hover:-translate-y-2 transition-all duration-300 shadow-sm shadow-slate-200/50 ${feature.shadow} hover:shadow-2xl`}
                >
                  {/* Icon Wrapper dengan Efek Pulse saat Parent Hover */}
                  <div className={`relative z-10 p-4 rounded-2xl ${feature.bg} ${feature.color} mb-5 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="w-7 h-7 stroke-[1.5]" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-bold text-slate-900 text-base tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">{feature.desc}</p>
                  </div>

                  {/* Decorative Background Element */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] bg-gradient-to-br from-transparent to-white/50 pointer-events-none`} />
                </div>
              ))}
            </section>
          </>
        )}
      </div>
      </main>

      <footer className="mt-24 bg-[#064e3b] text-emerald-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">

          {/* Newsletter / CTA Section (Inspirasi dari Gambar) */}
          <div className="bg-[#043d2f] rounded-[2.5rem] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between border border-emerald-800/50 shadow-xl">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Belanja Lebih Hemat di Aplikasi</h3>
              <p className="text-emerald-200/80 max-w-md">Dapatkan promo eksklusif dan gratis ongkir khusus pengguna baru melalui aplikasi kami.</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                className="px-8 py-3 bg-white text-[#064e3b] font-bold rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg"
                aria-label="Download Halal Mart app from App Store"
              >
                App Store
              </button>
              <button 
                className="px-8 py-3 bg-transparent border border-emerald-400 text-white font-bold rounded-2xl hover:bg-emerald-800/30 transition-colors"
                aria-label="Download Halal Mart app from Google Play"
              >
                Google Play
              </button>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-emerald-800/50">
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-2xl font-bold mb-5 tracking-tight">Elfan Halal Mart</h2>
              <p className="text-emerald-200/70 leading-relaxed">
                Pilihan terbaik untuk produk halal berkualitas di Solo. Kami berkomitmen menjaga amanah dan kualitas setiap produk yang Anda terima.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Belanja</h4>
              <ul className="space-y-4 text-emerald-200/70">
                <li><a href="/products" className="hover:text-white transition-colors" aria-label="Browse product categories">Kategori Produk</a></li>
                <li><a href="/products?filter=promo" className="hover:text-white transition-colors" aria-label="View member promotions">Promo Member</a></li>
                <li><a href="/products?filter=flash-sale" className="hover:text-white transition-colors" aria-label="View flash sale products">Flash Sale</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Informasi</h4>
              <ul className="space-y-4 text-emerald-200/70">
                <li><a href="/about" className="hover:text-white transition-colors" aria-label="Learn about Elfan Halal Mart">Tentang Elfan</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors" aria-label="Read our privacy policy">Kebijakan Privasi</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors" aria-label="Contact us for support">Kontak Kami</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Metode Pembayaran</h4>
              <div className="flex flex-wrap gap-2">
                {['BCA', 'BNI', 'Mandiri', 'QRIS'].map((pay) => (
                  <span key={pay} className="px-3 py-1 bg-emerald-900/50 border border-emerald-700/50 rounded-lg text-[10px] font-bold tracking-tighter">
                    {pay}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs text-emerald-200/50 leading-loose">
                Jl. Slamet Riyadi, Surakarta<br />
                Jawa Tengah, Indonesia
              </p>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-emerald-200/40 text-sm italic">
            <p>&copy; 2026 Elfan Halal Mart. Semua hak dilindungi.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="https://instagram.com/elfanhalal" className="hover:text-emerald-100 cursor-pointer" aria-label="Follow us on Instagram">Instagram</a>
              <a href="https://tiktok.com/@elfanhalal" className="hover:text-emerald-100 cursor-pointer" aria-label="Follow us on TikTok">TikTok</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}