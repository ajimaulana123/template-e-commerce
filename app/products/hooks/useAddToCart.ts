import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/cart'

export function useAddToCart() {
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const router = useRouter()

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setAddingToCart(productId)
      await addToCart(productId, 1)
      alert('Product added to cart successfully!')
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
