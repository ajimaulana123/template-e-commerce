'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductsPageClientProps } from './types'
import { useProducts } from './hooks/useProducts'
import { useAddToCart } from './hooks/useAddToCart'
import { useCategoryFilter } from './hooks/useCategoryFilter'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { ProductsHeader } from './components/ProductsHeader'
import { CategoryFilter } from './components/CategoryFilter'
import { ProductsGrid } from './components/ProductsGrid'
import { ProductsPageSkeleton } from './components/ProductsPageSkeleton'

export default function ProductsPageClient({ categorySlug }: ProductsPageClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get('category')
  const searchQuery = searchParams.get('search') || ''
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  
  // Debounce local search to avoid filtering on every keystroke
  const debouncedLocalSearch = useDebounce(localSearchQuery, 300)

  const {
    products,
    categories,
    selectedCategory,
    loading,
    productsLoading,
    pagination,
    setSelectedCategory,
    fetchProducts
  } = useProducts(categorySlug || categoryParam || undefined, searchQuery)

  const { addingToCart, handleAddToCart } = useAddToCart()
  const { handleCategoryFilter } = useCategoryFilter(setSelectedCategory, fetchProducts)

  // Re-fetch when URL changes
  useEffect(() => {
    if (!loading && categories.length > 0) {
      const urlCategory = categoryParam || categorySlug
      if (urlCategory) {
        const category = categories.find(cat => cat.slug === urlCategory)
        if (category && category.id !== selectedCategory?.id) {
          setSelectedCategory(category)
          fetchProducts(category, searchQuery, 1)
        }
      } else if (selectedCategory) {
        setSelectedCategory(null)
        fetchProducts(null, searchQuery, 1)
      }
    }
  }, [categoryParam, categorySlug])

  // Filter products locally using debounced search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(debouncedLocalSearch.toLowerCase())
  )

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      fetchProducts(selectedCategory, searchQuery, pagination.page - 1, pagination.limit)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (pagination.hasMore) {
      fetchProducts(selectedCategory, searchQuery, pagination.page + 1, pagination.limit)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGoToPage = (page: number) => {
    fetchProducts(selectedCategory, searchQuery, page, pagination.limit)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <ProductsPageSkeleton />
  }

  return (
    <div className="space-y-6 relative top-10 sm:top-0">
      <ProductsHeader
        selectedCategory={selectedCategory}
        productsCount={filteredProducts.length}
        searchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryFilter}
        variant="mobile"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategoryFilter}
          variant="desktop"
        />

        <div className="col-span-1 lg:col-span-3">
          <ProductsGrid
            products={filteredProducts}
            loading={productsLoading}
            addingToCart={addingToCart}
            onAddToCart={handleAddToCart}
            pagination={pagination}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onGoToPage={handleGoToPage}
          />
        </div>
      </div>
    </div>
  )
}