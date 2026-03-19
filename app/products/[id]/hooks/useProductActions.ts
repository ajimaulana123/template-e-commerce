import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/cart'

export function useProductActions(productId: string) {
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const router = useRouter()

  const handleQuantityChange = (change: number, maxStock: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(true)
      await addToCart(productId, quantity)
      alert('Product added to cart successfully!')
    } catch (error: any) {
      if (error.message === 'SessionExpired') {
        alert('Your session has expired. Please login again.')
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        alert(error.message || 'Failed to add to cart')
      }
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async (productId: string) => {
    try {
      setAddingToCart(true)
      await addToCart(productId, quantity)
      router.push('/cart')
    } catch (error: any) {
      if (error.message === 'SessionExpired') {
        alert('Your session has expired. Please login again.')
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        alert(error.message || 'Failed to add to cart')
      }
    } finally {
      setAddingToCart(false)
    }
  }

  return {
    quantity,
    addingToCart,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow
  }
}
