import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'

export function useAddToCart() {
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const router = useRouter()
  const { addToCart: addToCartStore } = useCart()

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setAddingToCart(productId)
      const success = await addToCartStore(productId, 1)
      
      if (success) {
        alert('Product added to cart successfully!')
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        alert(error.message || 'Failed to add to cart')
      }
    } finally {
      setAddingToCart(null)
    }
  }

  return { addingToCart, handleAddToCart }
}
