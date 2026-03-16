'use client'

import { useEffect, useState } from 'react'
import { useChatContext } from '../ChatContext'
import { Input } from '@/components/ui/input'
import { Product, Category } from './types'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import ProductDetailModal from './ProductDetailModal'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
}

export default function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const { setPageContext } = useChatContext()
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const handleEditFromModal = (product: Product) => {
    setViewingProduct(null)
    // Note: Edit functionality is now handled directly in ProductList
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Create Product Form */}
        <div>
          <ProductForm categories={categories} />
        </div>

        {/* Product List */}
        <div>
          <ProductList
            products={filteredProducts}
            categories={categories}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={handleEditFromModal}
      />
    </div>
  )
}