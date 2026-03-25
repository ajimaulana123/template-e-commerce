import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/cart'
import { toast } from '@/components/ui/use-toast'
import { CheckCircle2 } from 'lucide-react'

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
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'))
      
      toast({
        variant: "success",
        title: "Added to cart!",
        description: `${quantity} item(s) added to your cart successfully.`,
      })
    } catch (error: any) {
      if (error.message === 'SessionExpired') {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please login again to continue.",
        })
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add to cart",
          description: error.message || "Something went wrong. Please try again.",
        })
      }
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async (productId: string) => {
    try {
      setAddingToCart(true)
      await addToCart(productId, quantity)
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'))
      
      router.push('/cart')
    } catch (error: any) {
      if (error.message === 'SessionExpired') {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please login again to continue.",
        })
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else if (error.message === 'Unauthorized') {
        const returnUrl = encodeURIComponent(`/products/${productId}`)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to process",
          description: error.message || "Something went wrong. Please try again.",
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
