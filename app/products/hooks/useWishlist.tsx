import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWishlistManager } from '@/lib/hooks/useWishlistManager'
import { toast } from '@/components/ui/use-toast'

export function useWishlist(productId: string) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isInWishlist, toggleWishlist: toggleWishlistStore } = useWishlistManager()

  const inWishlist = isInWishlist(productId)

  const toggleWishlist = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    try {
      setLoading(true)

      const wasAdded = await toggleWishlistStore(productId)

      if (wasAdded) {
        toast({
          variant: "success",
          title: "Added to wishlist!",
          description: "Product saved to your wishlist.",
        })
      } else {
        toast({
          title: "Removed from wishlist",
          description: "Product removed from your wishlist.",
        })
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized' || error.message?.includes('Unauthorized')) {
        toast({
          variant: "destructive",
          title: "Login required",
          description: "Please login to add items to wishlist.",
        })
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/login?redirect=${returnUrl}`)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update wishlist",
          description: error.message || "Something went wrong. Please try again.",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return { inWishlist, loading, toggleWishlist }
}
