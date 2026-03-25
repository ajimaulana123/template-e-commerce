import { useEffect, useCallback } from 'react'
import { useWishlistStore } from '@/lib/stores/wishlist-store'

/**
 * Custom hook for wishlist management with server sync
 * 
 * Features:
 * - Local state for instant updates
 * - Auto-sync to server in background
 * - Optimistic updates
 * - Error handling with rollback
 */
export function useWishlistManager() {
  const store = useWishlistStore()

  // Fetch wishlist from server on mount
  useEffect(() => {
    fetchWishlist()
  }, [])

  // Fetch wishlist from server
  const fetchWishlist = useCallback(async () => {
    try {
      store.setLoading(true)
      const response = await fetch('/api/wishlist')
      
      if (response.ok) {
        const data = await response.json()
        store.setItems(data)
      } else {
        // Not logged in or error, clear wishlist
        store.setItems([])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      store.setItems([])
    } finally {
      store.setLoading(false)
    }
  }, [])

  // Add item to wishlist (optimistic + sync)
  const addToWishlist = useCallback(async (productId: string) => {
    try {
      // Fetch product details first
      const productResponse = await fetch(`/api/products/${productId}`)
      if (!productResponse.ok) throw new Error('Product not found')
      
      const product = await productResponse.json()

      // Optimistic update
      const wishlistItem = {
        id: `temp-${Date.now()}`,
        productId,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          stock: product.stock,
          category: product.category
        }
      }
      
      store.addItem(wishlistItem)

      // Sync to server in background
      store.setSyncing(true)
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add to wishlist')
      }

      // Refresh wishlist to get server IDs
      await fetchWishlist()

      return true
    } catch (error) {
      // Rollback on error
      store.removeItem(productId)
      console.error('Failed to add to wishlist:', error)
      throw error
    } finally {
      store.setSyncing(false)
    }
  }, [])

  // Remove item (optimistic + sync)
  const removeFromWishlist = useCallback(async (productId: string) => {
    const previousItems = [...store.items]
    const wishlistItem = store.getItem(productId)
    
    if (!wishlistItem) return false

    try {
      // Optimistic update
      store.removeItem(productId)

      // Sync to server
      store.setSyncing(true)
      const response = await fetch(`/api/wishlist/${wishlistItem.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove item')

      return true
    } catch (error) {
      // Rollback on error
      store.setItems(previousItems)
      console.error('Failed to remove item:', error)
      throw error
    } finally {
      store.setSyncing(false)
    }
  }, [])

  // Toggle wishlist (add or remove)
  const toggleWishlist = useCallback(async (productId: string) => {
    const isInWishlist = store.isInWishlist(productId)
    
    if (isInWishlist) {
      await removeFromWishlist(productId)
      return false // Removed
    } else {
      await addToWishlist(productId)
      return true // Added
    }
  }, [])

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    const previousItems = [...store.items]
    
    try {
      // Optimistic update
      store.clearWishlist()

      // Sync to server (if API supports bulk delete)
      store.setSyncing(true)
      // Note: You may need to implement bulk delete API endpoint
      
      return true
    } catch (error) {
      // Rollback on error
      store.setItems(previousItems)
      console.error('Failed to clear wishlist:', error)
      return false
    } finally {
      store.setSyncing(false)
    }
  }, [])

  return {
    items: store.items,
    loading: store.loading,
    syncing: store.syncing,
    totalItems: store.totalItems(),
    isInWishlist: store.isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    refreshWishlist: fetchWishlist
  }
}
