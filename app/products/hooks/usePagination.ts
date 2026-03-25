import { useState, useCallback } from 'react'

interface PaginationState {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasMore: boolean
}

export function usePagination(initialLimit: number = 20) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    totalCount: 0,
    totalPages: 0,
    hasMore: false
  })

  const updatePagination = useCallback((data: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...data }))
  }, [])

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages)
    }))
  }, [])

  const prevPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 1)
    }))
  }, [])

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages))
    }))
  }, [])

  const resetPagination = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }))
  }, [])

  return {
    pagination,
    updatePagination,
    nextPage,
    prevPage,
    goToPage,
    resetPagination
  }
}
