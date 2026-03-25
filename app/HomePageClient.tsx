'use client'

import { useEffect, useState } from 'react'
import CategoryIcons from '@/components/CategoryIcons'
import ProductGrid from '@/components/ProductGrid'
import CategoryIconsSkeleton from '@/components/skeletons/CategoryIconsSkeleton'
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData)
        }

        // Fetch products
        const productsResponse = await fetch('/api/products?limit=100')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          // Handle both old format (array) and new format (object with products array)
          setProducts(Array.isArray(productsData) ? productsData : productsData.products || [])
        }
      } catch (error) {
        // Silent fail - failed to fetch data
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to format product for ProductGrid
  const formatProductForGrid = (product: Product) => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(price)
    }

    return {
      id: product.id,
      name: product.name,
      price: formatPrice(product.price),
      originalPrice: product.originalPrice ? formatPrice(product.originalPrice) : undefined,
      images: product.images && product.images.length > 0 ? product.images : [product.image || '/placeholder.png'],
      rating: Math.round(product.rating),
      sold: product.sold.toString(),
      badge: product.badge || undefined
    }
  }

  // Get Flash Sale products (products with badge and originalPrice)
  const flashSaleProducts = products
    .filter(product => product.badge && product.originalPrice)
    .slice(0, 6)
    .map(formatProductForGrid)

  // Get Popular products (products with highest sold count)
  const popularProducts = products
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 8)
    .map(formatProductForGrid)

  // Get New products (latest created products)
  const newProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map(formatProductForGrid)

  // Get Recommended products (products with good stock and sales)
  const recommendedProducts = products
    .filter(product => product.stock > 0)
    .sort((a, b) => (b.sold * 0.7 + b.stock * 0.3) - (a.sold * 0.7 + a.stock * 0.3))
    .slice(0, 6)
    .map(formatProductForGrid)

  return (
    <>
      {/* Category Icons */}
      {loading ? (
        <CategoryIconsSkeleton />
      ) : (
        <CategoryIcons categories={categories} />
      )}

      {/* Product Sections */}
      <div className="container mx-auto px-4">
        {loading ? (
          <>
            <ProductCardSkeleton columns={6} />
            <ProductCardSkeleton columns={4} />
            <ProductCardSkeleton columns={6} />
            <ProductCardSkeleton columns={6} />
          </>
        ) : (
          <>
            {/* Flash Sale - Only show if there are flash sale products */}
            {flashSaleProducts.length > 0 && (
              <ProductGrid 
                title="⚡ Flash Sale Hari Ini" 
                icon="fas fa-bolt"
                products={flashSaleProducts}
                columns={6}
              />
            )}

            {/* Popular Products */}
            {popularProducts.length > 0 && (
              <ProductGrid 
                title="🔥 Produk Terpopuler" 
                icon="fas fa-fire"
                products={popularProducts}
                columns={4}
              />
            )}

            {/* New Products */}
            {newProducts.length > 0 && (
              <ProductGrid 
                title="✨ Produk Terbaru" 
                icon="fas fa-sparkles"
                products={newProducts}
                columns={6}
              />
            )}

            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
              <ProductGrid 
                title="💡 Rekomendasi Untuk Anda" 
                icon="fas fa-lightbulb"
                products={recommendedProducts}
                columns={6}
              />
            )}

            {/* Show message if no products */}
            {products.length === 0 && (
              <div className="bg-white rounded-lg p-12 text-center mb-6">
                <i className="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products available</h3>
                <p className="text-gray-500">Products will appear here once they are added by admin</p>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">Belanja Lebih Hemat dengan Aplikasi</h2>
          <p className="text-lg mb-6">Download aplikasi kami dan dapatkan diskon eksklusif</p>
          <div className="flex items-center justify-center space-x-4">
            <a href="#" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              <i className="fab fa-apple mr-2"></i>App Store
            </a>
            <a href="#" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              <i className="fab fa-google-play mr-2"></i>Google Play
            </a>
          </div>
        </section>

        {/* Footer Info */}
        <section className="bg-white rounded-lg p-8 mb-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <i className="fas fa-shipping-fast text-4xl text-blue-600 mb-3"></i>
              <h3 className="font-bold text-gray-900 mb-2">Gratis Ongkir</h3>
              <p className="text-sm text-gray-600">Untuk pembelian di atas Rp500.000</p>
            </div>
            <div>
              <i className="fas fa-shield-alt text-4xl text-green-600 mb-3"></i>
              <h3 className="font-bold text-gray-900 mb-2">Garansi Resmi</h3>
              <p className="text-sm text-gray-600">100% produk original bergaransi</p>
            </div>
            <div>
              <i className="fas fa-headset text-4xl text-orange-600 mb-3"></i>
              <h3 className="font-bold text-gray-900 mb-2">Customer Service</h3>
              <p className="text-sm text-gray-600">Siap membantu 24/7</p>
            </div>
            <div>
              <i className="fas fa-undo text-4xl text-purple-600 mb-3"></i>
              <h3 className="font-bold text-gray-900 mb-2">Easy Return</h3>
              <p className="text-sm text-gray-600">Pengembalian mudah dalam 7 hari</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white rounded-lg p-8 text-center text-gray-500">
          <p>&copy; 2024 E-Commerce Jepang. Semua hak dilindungi.</p>
        </footer>
      </div>
    </>
  )
}