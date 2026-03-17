import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '../types'

export function useCategoryFilter(
  setSelectedCategory: (category: Category | null) => void,
  fetchProducts: (category: Category | null) => void
) {
  const router = useRouter()

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      const { category } = event.detail
      setSelectedCategory(category)
      fetchProducts(category)
    }

    window.addEventListener('categoryChange', handleCategoryChange as EventListener)
    
    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener)
    }
  }, [setSelectedCategory, fetchProducts])

  const handleCategoryFilter = async (category: Category | null, categorySlug: string | null) => {
    const url = categorySlug ? `/products?category=${categorySlug}` : '/products'
    router.push(url)
  }

  return { handleCategoryFilter }
}
