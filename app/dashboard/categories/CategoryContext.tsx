'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Category } from './types'
import { useCategorySync } from './hooks/useCategorySync'

interface CategoryContextType {
  categories: Category[]
  actions: {
    addCategory: (category: Category) => void
    updateCategory: (id: string, category: Category) => void
    removeCategory: (id: string) => void
    refreshCategories: () => Promise<Category[]>
    subscribe: (listener: (categories: Category[]) => void) => () => void
  }
}

const CategoryContext = createContext<CategoryContextType | null>(null)

interface CategoryProviderProps {
  children: ReactNode
  initialCategories: Category[]
}

export function CategoryProvider({ children, initialCategories }: CategoryProviderProps) {
  const categorySync = useCategorySync(initialCategories)

  return (
    <CategoryContext.Provider value={categorySync}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategoryContext() {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategoryContext must be used within CategoryProvider')
  }
  return context
}