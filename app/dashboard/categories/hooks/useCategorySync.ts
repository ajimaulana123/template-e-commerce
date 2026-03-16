import { useState, useCallback, useRef } from 'react'
import { Category } from '../types'

/**
 * Hook untuk sinkronisasi data kategori antar komponen
 * Memungkinkan real-time updates tanpa perlu router.refresh()
 */
export const useCategorySync = (initialCategories: Category[]) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const listenersRef = useRef<Set<(categories: Category[]) => void>>(new Set())

  // Subscribe to category changes
  const subscribe = useCallback((listener: (categories: Category[]) => void) => {
    listenersRef.current.add(listener)
    
    // Return unsubscribe function
    return () => {
      listenersRef.current.delete(listener)
    }
  }, [])

  // Notify all listeners
  const notifyListeners = useCallback((newCategories: Category[]) => {
    listenersRef.current.forEach(listener => listener(newCategories))
  }, [])

  // Add new category (optimistic update)
  const addCategory = useCallback((newCategory: Category) => {
    setCategories(prev => {
      const updated = [...prev, newCategory]
      notifyListeners(updated)
      return updated
    })
  }, [notifyListeners])

  // Update existing category
  const updateCategory = useCallback((id: string, updatedCategory: Category) => {
    setCategories(prev => {
      const updated = prev.map(cat => cat.id === id ? updatedCategory : cat)
      notifyListeners(updated)
      return updated
    })
  }, [notifyListeners])

  // Remove category
  const removeCategory = useCallback((id: string) => {
    setCategories(prev => {
      const updated = prev.filter(cat => cat.id !== id)
      notifyListeners(updated)
      return updated
    })
  }, [notifyListeners])

  // Refresh categories from server
  const refreshCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const freshCategories = await response.json()
        setCategories(freshCategories)
        notifyListeners(freshCategories)
        return freshCategories
      }
    } catch (error) {
      console.error('Failed to refresh categories:', error)
    }
    return categories
  }, [categories, notifyListeners])

  return {
    categories,
    actions: {
      addCategory,
      updateCategory,
      removeCategory,
      refreshCategories,
      subscribe
    }
  }
}