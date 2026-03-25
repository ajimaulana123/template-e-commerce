import { useState, useEffect } from 'react'
import { Product, Category } from '../types'

interface PaginationData {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasMore: boolean
}

export function useProducts(categorySlug?: string, searchQuery?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasMore: false
  })

  const fetchProducts = async (
    category: Category | null, 
    search?: string, 
    page: number = 1,
    limit: number = 20
  ) => {
    try {
      setProductsLoading(true)
      
      const params = new URLSearchParams()
      if (category) params.append('categoryId', category.id)
      if (search) params.append('search', search)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      const response = await fetch(`/api/products?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || data) // Support both old and new format
        
        // Update pagination if available
        if (data.pagination) {
          setPagination(data.pagination)
        }
      }
    } catch (error) {
      // Silent fail
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        
        const response = await fetch('/api/categories')
        if (response.ok) {
          const categoriesData = await response.json()
          setCategories(categoriesData)

          const selectedCat = categorySlug 
            ? categoriesData.find((cat: Category) => cat.slug === categorySlug) || null
            : null
          
          setSelectedCategory(selectedCat)
          await fetchProducts(selectedCat, searchQuery)
        }
      } catch (error) {
        // Silent fail
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [categorySlug, searchQuery])

  return {
    products,
    categories,
    selectedCategory,
    loading,
    productsLoading,
    pagination,
    setSelectedCategory,
    fetchProducts
  }
}
