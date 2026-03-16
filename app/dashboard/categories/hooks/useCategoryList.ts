import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Category, 
  UpdateCategoryData, 
  CategoryListState,
  SortState,
  FilterState
} from '../types'
import { CategoryService, handleApiError } from '../services'
import { 
  validateCategoryForm, 
  sanitizeFormData, 
  checkRateLimit 
} from '../validation'
import { useCategoryContext } from '../CategoryContext'

export const useCategoryList = () => {
  const router = useRouter()
  const { categories: contextCategories, actions: categoryActions } = useCategoryContext()
  const [state, setState] = useState<CategoryListState>({
    editingId: null,
    loading: false,
    error: null,
    searchQuery: ''
  })
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    order: 'asc'
  })
  const [filterState, setFilterState] = useState<FilterState>({
    hasProducts: null,
    iconCategory: null
  })

  // Memoized filtered and sorted categories
  const filteredCategories = useMemo(() => {
    let filtered = contextCategories.filter(category => {
      // Search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        return (
          category.name.toLowerCase().includes(query) ||
          category.slug.toLowerCase().includes(query)
        )
      }
      return true
    }).filter(category => {
      // Products filter
      if (filterState.hasProducts !== null) {
        return filterState.hasProducts 
          ? category._count.products > 0 
          : category._count.products === 0
      }
      return true
    })

    // Sort
    return filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortState.field) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'productsCount':
          aValue = a._count.products
          bValue = b._count.products
          break
        default:
          return 0
      }
      
      if (sortState.order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [contextCategories, state.searchQuery, filterState, sortState])

  // Update state helper
  const updateState = useCallback((updates: Partial<CategoryListState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Search handler
  const handleSearch = useCallback((query: string) => {
    updateState({ searchQuery: query })
  }, [updateState])

  // Sort handler
  const handleSort = useCallback((field: SortState['field']) => {
    setSortState(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  // Filter handlers
  const handleFilterByProducts = useCallback((hasProducts: boolean | null) => {
    setFilterState(prev => ({ ...prev, hasProducts }))
  }, [])

  // Edit handlers
  const startEdit = useCallback((id: string) => {
    updateState({ editingId: id, error: null })
  }, [updateState])

  const cancelEdit = useCallback(() => {
    updateState({ editingId: null, error: null })
  }, [updateState])

  // Update category with optimistic update
  const updateCategory = useCallback(async (id: string, data: UpdateCategoryData) => {
    if (!checkRateLimit()) {
      updateState({ error: 'Terlalu banyak permintaan. Silakan tunggu sebentar.' })
      return false
    }

    updateState({ loading: true, error: null })

    try {
      // Create sanitized data with proper type
      const sanitizedData: UpdateCategoryData = {
        id: data.id,
        name: sanitizeFormData(data).name,
        slug: sanitizeFormData(data).slug,
        icon: sanitizeFormData(data).icon
      }
      
      const errors = validateCategoryForm(sanitizedData)
      
      if (Object.keys(errors).length > 0) {
        updateState({ error: Object.values(errors)[0] })
        return false
      }

      const updatedCategory = await CategoryService.updateCategory(id, sanitizedData)
      
      // Add _count field if not present
      const categoryWithCount = {
        ...updatedCategory,
        _count: updatedCategory._count || { products: 0 }
      }
      
      // Optimistic update via context
      categoryActions.updateCategory(id, categoryWithCount)
      
      updateState({ editingId: null })
      
      // Optional: Still refresh router for server-side consistency
      setTimeout(() => router.refresh(), 100)
      
      return true
    } catch (error) {
      updateState({ error: handleApiError(error) })
      return false
    } finally {
      updateState({ loading: false })
    }
  }, [updateState, router, categoryActions])

  // Delete category with optimistic update
  const deleteCategory = useCallback(async (id: string) => {
    if (!checkRateLimit()) {
      updateState({ error: 'Terlalu banyak permintaan. Silakan tunggu sebentar.' })
      return false
    }

    updateState({ loading: true, error: null })

    try {
      await CategoryService.deleteCategory(id)
      
      // Optimistic update via context
      categoryActions.removeCategory(id)
      
      // Optional: Still refresh router for server-side consistency
      setTimeout(() => router.refresh(), 100)
      
      return true
    } catch (error) {
      updateState({ error: handleApiError(error) })
      return false
    } finally {
      updateState({ loading: false })
    }
  }, [updateState, router, categoryActions])

  return {
    categories: filteredCategories,
    state,
    sortState,
    filterState,
    actions: {
      handleSearch,
      handleSort,
      handleFilterByProducts,
      startEdit,
      cancelEdit,
      updateCategory,
      deleteCategory
    }
  }
}