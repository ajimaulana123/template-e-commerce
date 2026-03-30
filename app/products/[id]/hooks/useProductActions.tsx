import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from '@/components/ui/use-toast'

export function useProductActions(productId: string) {
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const router = useRouter()
  const { addToCart: addToCartStore } = useCart()

  const handleQuantityChange = (change: number, maxStock: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(true)
      const success = await addToCartStore(productId, quantity)
      
      if (success) {
        toast({
          title: "Added to cart!",
          description: `${quantity} item(s) added to your cart successfully.`,
          duration: 2000,
        })
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add to cart",
          description: error.message || "Something went wrong. Please try again.",
          duration: 3000,
        })
      }
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async (productId: string) => {
    try {
      setAddingToCart(true)
      const success = await addToCartStore(productId, quantity)
      
      if (success) {
        router.push('/cart')
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to process",
          description: error.message || "Something went wrong. Please try again.",
          duration: 3000,
        })
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
