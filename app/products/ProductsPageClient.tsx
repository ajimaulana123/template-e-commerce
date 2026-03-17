'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { addToCart } from '@/lib/cart'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  stock: number
  sold: number
  badge: string | null
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  icon: string | null
  slug: string
}

interface ProductsPageClientProps {
  categorySlug?: string
}

export default function ProductsPageClient({ categorySlug }: ProductsPageClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const router = useRouter()

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData)

          // Find selected category if categorySlug is provided
          let selectedCat = null
          if (categorySlug) {
            selectedCat = categoriesData.find((cat: Category) => cat.slug === categorySlug)
          }
          setSelectedCategory(selectedCat)

          // Fetch products with or without category filter
          const productsUrl = selectedCat 
            ? `/api/products?categoryId=${selectedCat.id}`
            : '/api/products'
          
          const productsResponse = await fetch(productsUrl)
          if (productsResponse.ok) {
            const productsData = await productsResponse.json()
            setProducts(productsData)
          }
        }
      } catch (error) {
        // Silent fail - failed to fetch data
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [categorySlug])

  // Listen for category changes from modal or other components
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      const { category, slug } = event.detail
      setSelectedCategory(category)
      fetchProducts(category)
    }

    window.addEventListener('categoryChange', handleCategoryChange as EventListener)
    
    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener)
    }
  }, [])

  // Function to fetch products only
  const fetchProducts = async (category: Category | null) => {
    try {
      setProductsLoading(true)
      
      const productsUrl = category 
        ? `/api/products?categoryId=${category.id}`
        : '/api/products'
      
      const productsResponse = await fetch(productsUrl)
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData)
      }
    } catch (error) {
      // Silent fail - failed to fetch products
    } finally {
      setProductsLoading(false)
    }
  }

  const handleCategoryFilter = async (category: Category | null, categorySlug: string | null) => {
    // Update URL without page refresh
    const url = categorySlug ? `/products?category=${categorySlug}` : '/products'
    window.history.pushState({}, '', url)
    
    // Update selected category
    setSelectedCategory(category)
    
    // Fetch new products
    await fetchProducts(category)
  }

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setAddingToCart(productId)
      await addToCart(productId, 1)
      
      alert('Product added to cart successfully!')
      
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        alert(error.message || 'Failed to add to cart')
      }
    } finally {
      setAddingToCart(null)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const calculateDiscount = (price: number, originalPrice: number | null) => {
    if (!originalPrice) return null
    const discount = ((originalPrice - price) / originalPrice) * 100
    return Math.round(discount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <Skeleton className="h-6 lg:h-8 w-32 lg:w-48 mb-2" />
              <Skeleton className="h-4 w-24 lg:w-32" />
            </div>
            <Skeleton className="h-10 w-full lg:w-64" />
          </div>
        </div>

        {/* Mobile Category Filter Skeleton */}
        <div className="lg:hidden bg-white rounded-lg p-4">
          <Skeleton className="h-5 w-20 mb-3" />
          <div className="flex overflow-x-auto pb-2 space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="flex-shrink-0 h-8 w-20" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative top-10 sm:top-0">
      <div className="bg-white rounded-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {selectedCategory ? selectedCategory.name : 'All Products'}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              {filteredProducts.length} products found
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64"
            />
          </div>
        </div>
      </div>

      {/* Mobile Category Filter */}
      <div className="lg:hidden bg-white rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
        <div className="flex overflow-x-auto pb-2 space-x-2">
          <button
            onClick={() => handleCategoryFilter(null, null)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory 
                ? 'bg-blue-100 text-blue-600 font-semibold' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-th mr-2"></i>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category, category.slug)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory?.id === category.id 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <i className={`${category.icon || 'fas fa-th'} mr-2`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryFilter(null, null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  !selectedCategory 
                    ? 'bg-blue-100 text-blue-600 font-semibold' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-th mr-2"></i>
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category, category.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory?.id === category.id 
                      ? 'bg-blue-100 text-blue-600 font-semibold' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <i className={`${category.icon || 'fas fa-th'} mr-2`}></i>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-span-1 lg:col-span-3">
          {productsLoading ? (
            /* Products Loading State */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 lg:p-12 text-center">
              <i className="fas fa-search text-3xl lg:text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm lg:text-base">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.badge && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {product.badge}
                        </div>
                      )}
                      {product.originalPrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          -{calculateDiscount(product.price, product.originalPrice)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-blue-600 font-semibold mb-1">
                        {product.category.name}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base">
                        {product.name}
                      </h3>
                      <div className="space-y-1 mb-3">
                        <div className="text-base lg:text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-xs lg:text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs lg:text-sm text-gray-600 mb-3">
                        <span>
                          <i className="fas fa-box mr-1"></i>
                          Stock: {product.stock}
                        </span>
                        <span>
                          <i className="fas fa-shopping-cart mr-1"></i>
                          Sold: {product.sold}
                        </span>
                      </div>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-sm lg:text-base"
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={addingToCart === product.id || product.stock === 0}
                      >
                        <i className="fas fa-cart-plus mr-2"></i>
                        {addingToCart === product.id ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}