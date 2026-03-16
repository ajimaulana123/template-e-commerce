// Product domain types for dashboard
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  stock: number
  sold: number
  rating: number
  badge: string | null
  createdAt: Date
  updatedAt: Date
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
    icon: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  createdAt: Date
  updatedAt: Date
}

// Form data types
export interface CreateProductData {
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  stock: number
  categoryId: string
  badge: string | null
}

export interface UpdateProductData extends CreateProductData {
  id: string
}

// API response types
export interface ProductApiResponse {
  success: boolean
  data?: Product
  message?: string
  error?: string
}

export interface ProductsApiResponse {
  success: boolean
  data?: Product[]
  message?: string
  error?: string
}

// Form validation types
export interface ProductFormErrors {
  name?: string
  description?: string
  price?: string
  originalPrice?: string
  image?: string
  stock?: string
  categoryId?: string
  badge?: string
  general?: string
}

// UI state types
export interface ProductListState {
  editingId: string | null
  loading: boolean
  error: string | null
  searchQuery: string
}

export interface CreateProductState {
  loading: boolean
  error: string | null
  success: string | null
}

// Pagination types
export interface PaginationState {
  page: number
  limit: number
  total: number
}

// Sort types
export type ProductSortField = 'name' | 'price' | 'stock' | 'sold' | 'rating' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export interface ProductSortState {
  field: ProductSortField
  order: SortOrder
}

// Filter types
export interface ProductFilterState {
  categoryId: string | null
  priceRange: {
    min: number | null
    max: number | null
  }
  inStock: boolean | null
  hasBadge: boolean | null
}