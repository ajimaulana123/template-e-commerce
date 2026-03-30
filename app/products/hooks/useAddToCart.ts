import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import { useToast } from '@/components/ui/use-toast'

export function useAddToCart() {
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const router = useRouter()
  const { addToCart: addToCartStore } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setAddingToCart(productId)
      const success = await addToCartStore(productId, 1)
      
      if (success) {
        toast({
          title: "Added to cart",
          description: "Product has been added to your cart",
          duration: 2000,
        })
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        toast({
          title: "Error",
          description: error.message || 'Failed to add to cart',
          variant: "destructive",
          duration: 3000,
        })
      }
    } finally {
      setAddingToCart(null)
    }
  }

  return { addingToCart, handleAddToCart }
}
