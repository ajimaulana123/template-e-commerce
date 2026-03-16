// Category domain types
export interface Category {
  id: string
  name: string
  icon: string | null
  slug: string
  createdAt: Date
  updatedAt: Date
  _count: {
    products: number
  }
}

// Form data types
export interface CreateCategoryData {
  name: string
  icon: string
  slug: string
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: string
}

// API response types
export interface CategoryApiResponse {
  success: boolean
  data?: Category
  message?: string
  error?: string
}

export interface CategoriesApiResponse {
  success: boolean
  data?: Category[]
  message?: string
  error?: string
}

// Form validation types
export interface CategoryFormErrors {
  name?: string
  slug?: string
  icon?: string
  general?: string
}

// UI state types
export interface CategoryListState {
  editingId: string | null
  loading: boolean
  error: string | null
  searchQuery: string
}

export interface CreateCategoryState {
  loading: boolean
  error: string | null
  success: string | null
}

// Icon configuration
export interface IconOption {
  value: string
  label: string
  category: string
}

// Pagination types
export interface PaginationState {
  page: number
  limit: number
  total: number
}

// Sort types
export type SortField = 'name' | 'createdAt' | 'productsCount'
export type SortOrder = 'asc' | 'desc'

export interface SortState {
  field: SortField
  order: SortOrder
}

// Filter types
export interface FilterState {
  hasProducts: boolean | null
  iconCategory: string | null
}