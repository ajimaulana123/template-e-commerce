'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatContext } from '../ChatContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Product, Category } from './types'
import ProductList from './ProductList'

// Lazy load modals
const ProductDetailModal = dynamic(() => import('./ProductDetailModal'), {
  ssr: false
})

const EditProductModal = dynamic(() => import('./EditProductModal'), {
  ssr: false
})

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
}

export default function ProductsPageClient({ products: initialProducts, categories }: ProductsPageClientProps) {
  const { setPageContext } = useChatContext()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [creatingProduct, setCreatingProduct] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Update local state when server data changes
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handler untuk optimistic delete
  const handleOptimisticDelete = (productIds: string[]) => {
    setProducts(prev => prev.filter(p => !productIds.includes(p.id)))
  }

  // Handler untuk optimistic update
  const handleOptimisticUpdate = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))
  }

  // Handler untuk optimistic create
  const handleOptimisticCreate = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev])
  }

  useEffect(() => {
    // Set context when component mounts
    const contextData = `Kamu adalah AI assistant untuk sistem Product Management. Kamu memiliki akses ke data produk berikut:

TOTAL PRODUCTS: ${products.length}
TOTAL CATEGORIES: ${categories.length}

DAFTAR KATEGORI:
${categories.map((cat, idx) => `${idx + 1}. ${cat.name} (${cat.slug})`).join('\n')}

DAFTAR PRODUK (Top 10):
${products.slice(0, 10).map((prod, idx) => `${idx + 1}. ${prod.name} | Kategori: ${prod.category.name} | Harga: Rp${prod.price.toLocaleString()} | Stok: ${prod.stock} | Terjual: ${prod.sold}`).join('\n')}

STATISTIK PRODUK:
- Total Stok: ${products.reduce((sum, p) => sum + p.stock, 0)}
- Total Terjual: ${products.reduce((sum, p) => sum + p.sold, 0)}
- Rata-rata Harga: Rp${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString()}
- Produk dengan Stok Habis: ${products.filter(p => p.stock === 0).length}

INSTRUKSI:
- Selalu jawab dalam Bahasa Indonesia
- Gunakan data di atas untuk menjawab pertanyaan tentang produk
- Berikan analisis dan insight yang berguna
- Jika ditanya tentang produk tertentu, cari berdasarkan nama atau kategori
- Jika ditanya statistik, hitung dari data di atas
- Berikan saran yang konstruktif untuk product management

CONTOH PERTANYAAN YANG BISA DIJAWAB:
- Berapa total produk?
- Produk mana yang paling laris?
- Kategori mana yang paling banyak produknya?
- Produk mana yang stoknya habis?
- Berikan analisis performa penjualan
- Saran untuk optimasi inventory`

    setPageContext(contextData)

    // Clear context when component unmounts
    return () => {
      setPageContext(null)
    }
  }, [products, categories, setPageContext])

  const handleViewDetails = (product: Product) => {
    setViewingProduct(product)
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Product Management</h1>
            <p className="text-emerald-100 text-sm mt-1">Kelola semua produk Anda</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <i className="fas fa-box text-3xl"></i>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Produk', value: products.length, delay: 0.1 },
            { label: 'Total Stok', value: products.reduce((sum, p) => sum + p.stock, 0), delay: 0.2 },
            { label: 'Total Terjual', value: products.reduce((sum, p) => sum + p.sold, 0), delay: 0.3 },
            { label: 'Stok Habis', value: products.filter(p => p.stock === 0).length, delay: 0.4 }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: stat.delay }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="text-emerald-100 text-xs font-medium mb-1">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search and Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    className="h-12 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="fas fa-times mr-2"></i>
                    Clear
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                onClick={() => setCreatingProduct(true)}
              >
                <i className="fas fa-plus mr-2"></i>
                Tambah Produk
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Product List - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ProductList
          products={filteredProducts}
          categories={categories}
          onViewDetails={handleViewDetails}
          onOptimisticDelete={handleOptimisticDelete}
          onOptimisticUpdate={handleOptimisticUpdate}
        />
      </motion.div>

      {/* Create Product Modal */}
      <AnimatePresence>
        {creatingProduct && (
          <EditProductModal
            product={null}
            categories={categories}
            isOpen={creatingProduct}
            onClose={() => setCreatingProduct(false)}
            onSuccess={(newProduct) => {
              setCreatingProduct(false)
              if (newProduct) {
                handleOptimisticCreate(newProduct)
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {viewingProduct && (
          <ProductDetailModal
            product={viewingProduct}
            isOpen={!!viewingProduct}
            onClose={() => setViewingProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}