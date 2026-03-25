import { useEffect, useCallback } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'

/**
 * Custom hook for cart management with server sync
 * 
 * Features:
 * - Local state for instant updates
 * - Auto-sync to server in background
 * - Optimistic updates
 * - Error handling with rollback
 */
export function useCart() {
  const store = useCartStore()

  // Fetch cart from server on mount
  useEffect(() => {
    fetchCart()
  }, [])

  // Fetch cart from server
  const fetchCart = useCallback(async () => {
    try {
      store.setLoading(true)
      const response = await fetch('/api/cart')
      
      if (response.ok) {
        const data = await response.json()
        store.setItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      store.setLoading(false)
    }
  }, [])

  // Add item to cart (optimistic + sync)
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      // Fetch product details first
      const productResponse = await fetch(`/api/products/${productId}`)
      if (!productResponse.ok) throw new Error('Product not found')
      
      const product = await productResponse.json()

      // Optimistic update
      const cartItem = {
        id: `temp-${Date.now()}`,
        productId,
        quantity,
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
      
      store.addItem(cartItem)

      // Sync to server in background
      store.setSyncing(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      // Refresh cart to get server IDs
      await fetchCart()

      return true
    } catch (error) {
      // Rollback on error
      store.removeItem(productId)
      console.error('Failed to add to cart:', error)
      return false
    } finally {
      store.setSyncing(false)
    }
  }, [])

  // Update quantity (optimistic + sync)
  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    const previousItems = [...store.items]
    
    try {
      // Optimistic update
      store.updateQuantity(productId, quantity)

      // Sync to server
      store.setSyncing(true)
      const cartItem = store.getItem(productId)
      if (!cartItem) return

      const response = await fetch(`/api/cart/${cartItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })

      if (!response.ok) throw new Error('Failed to update quantity')

      return true
    } catch (error) {
      // Rollback on error
      store.setItems(previousItems)
      console.error('Failed to update quantity:', error)
      return false
    } finally {
      store.setSyncing(false)
    }
  }, [])

  // Remove item (optimistic + sync)
  const removeFromCart = useCallback(async (productId: string) => {
    const previousItems = [...store.items]
    const cartItem = store.getItem(productId)
    
    if (!cartItem) return false

    try {
      // Optimistic update
      store.removeItem(productId)

      // Sync to server
      store.setSyncing(true)
      const response = await fetch(`/api/cart/${cartItem.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove item')

      return true
    } catch (error) {
      // Rollback on error
      store.setItems(previousItems)
      console.error('Failed to remove item:', error)
      return false
    } finally {
      store.setSyncing(false)
    }
  }, [])

  // Clear cart
  const clearCart = useCallback(async () => {
    const previousItems = [...store.items]
    
    try {
      // Optimistic update
      store.clearCart()

      // Sync to server
      store.setSyncing(true)
      const response = await fetch('/api/cart', {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to clear cart')

      return true
    } catch (error) {
      // Rollback on error
      store.setItems(previousItems)
      console.error('Failed to clear cart:', error)
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
    totalPrice: store.totalPrice(),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart
  }
}
