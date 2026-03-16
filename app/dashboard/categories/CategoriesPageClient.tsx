'use client'

import { useEffect } from 'react'
import { useChatContext } from '../ChatContext'
import { Category } from './types'
import { CategoryProvider, useCategoryContext } from './CategoryContext'
import CreateCategoryForm from './CreateCategoryForm'
import CategoryList from './CategoryList'

interface CategoriesPageClientProps {
  categories: Category[]
}

function CategoriesContent() {
  const { setPageContext } = useChatContext()
  const { categories } = useCategoryContext()

  useEffect(() => {
    // Generate comprehensive context for AI assistant
    const totalProducts = categories.reduce((sum, cat) => sum + cat._count.products, 0)
    const categoriesWithProducts = categories.filter(cat => cat._count.products > 0)
    const emptyCategoriesCount = categories.length - categoriesWithProducts.length
    
    // Find most and least popular categories
    const sortedByProducts = [...categories].sort((a, b) => b._count.products - a._count.products)
    const mostPopular = sortedByProducts[0]
    const leastPopular = sortedByProducts[sortedByProducts.length - 1]

    const contextData = `Kamu adalah AI assistant untuk sistem Category Management. Kamu memiliki akses ke data kategori berikut:

STATISTIK KATEGORI:
- Total Kategori: ${categories.length}
- Kategori dengan Produk: ${categoriesWithProducts.length}
- Kategori Kosong: ${emptyCategoriesCount}
- Total Produk: ${totalProducts}
- Rata-rata Produk per Kategori: ${categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}

KATEGORI TERPOPULER:
${mostPopular ? `- ${mostPopular.name}: ${mostPopular._count.products} produk` : '- Belum ada kategori'}

KATEGORI DENGAN PRODUK PALING SEDIKIT:
${leastPopular && leastPopular._count.products > 0 ? `- ${leastPopular.name}: ${leastPopular._count.products} produk` : '- Semua kategori kosong atau belum ada kategori'}

DAFTAR KATEGORI:
${categories.map((cat, idx) => `${idx + 1}. ${cat.name} (${cat.slug}) - ${cat._count.products} produk - Icon: ${cat.icon || 'default'}`).join('\n')}

KATEGORI KOSONG:
${categories.filter(cat => cat._count.products === 0).map(cat => `- ${cat.name}`).join('\n') || 'Tidak ada kategori kosong'}

INSTRUKSI:
- Selalu jawab dalam Bahasa Indonesia
- Gunakan data di atas untuk menjawab pertanyaan tentang kategori
- Berikan analisis dan insight yang berguna untuk manajemen kategori
- Jika ditanya tentang kategori tertentu, cari berdasarkan nama atau slug
- Jika ditanya statistik, hitung dari data di atas
- Berikan saran yang konstruktif untuk category management
- Fokus pada optimasi dan efisiensi pengelolaan kategori

CONTOH PERTANYAAN YANG BISA DIJAWAB:
- Berapa total kategori dan produk?
- Kategori mana yang paling populer/banyak produknya?
- Kategori mana yang belum ada produknya?
- Berikan analisis distribusi produk per kategori
- Saran untuk optimasi struktur kategori
- Kategori mana yang perlu dipromosikan?
- Apakah ada kategori yang bisa digabung?
- Bagaimana cara meningkatkan penggunaan kategori kosong?`

    setPageContext(contextData)

    // Clear context when component unmounts
    return () => {
      setPageContext(null)
    }
  }, [categories, setPageContext])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-tags mr-3 text-blue-600" />
            Manajemen Kategori
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola kategori produk untuk mengorganisir toko Anda
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-gray-600">Kategori</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {categories.reduce((sum, cat) => sum + cat._count.products, 0)}
            </div>
            <div className="text-gray-600">Produk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {categories.filter(cat => cat._count.products === 0).length}
            </div>
            <div className="text-gray-600">Kosong</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Create Category Form */}
        <div className="order-2 xl:order-1">
          <CreateCategoryForm />
        </div>

        {/* Category List */}
        <div className="order-1 xl:order-2">
          <CategoryList />
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Statistik Cepat</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Kategori</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">
              {categories.reduce((sum, cat) => sum + cat._count.products, 0)}
            </div>
            <div className="text-sm text-gray-600">Produk</div>
          </div>
          <div>
            <div className="text-xl font-bold text-orange-600">
              {categories.filter(cat => cat._count.products === 0).length}
            </div>
            <div className="text-sm text-gray-600">Kosong</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <i className="fas fa-lightbulb text-blue-500 mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Tips Manajemen Kategori</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Gunakan nama kategori yang jelas dan mudah dipahami pelanggan</li>
              <li>• Pilih icon yang representatif untuk setiap kategori</li>
              <li>• Hindari terlalu banyak kategori kosong - gabungkan jika perlu</li>
              <li>• Review dan optimasi struktur kategori secara berkala</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  return (
    <CategoryProvider initialCategories={categories}>
      <CategoriesContent />
    </CategoryProvider>
  )
}
