import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addToWishlist, removeFromWishlist, checkWishlist } from '@/lib/wishlist'

export function useWishlist(productId: string) {
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkWishlistStatus()
  }, [productId])

  const checkWishlistStatus = async () => {
    try {
      const result = await checkWishlist(productId)
      setInWishlist(result.inWishlist)
      setWishlistItemId(result.wishlistItemId)
    } catch (error) {
      // Silent fail
    }
  }

  const toggleWishlist = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    try {
      setLoading(true)

      if (inWishlist && wishlistItemId) {
        await removeFromWishlist(wishlistItemId)
        setInWishlist(false)
        setWishlistItemId(null)
      } else {
        const result = await addToWishlist(productId)
        setInWishlist(true)
        setWishlistItemId(result.id)
      }

      // Trigger wishlist count update
      window.dispatchEvent(new CustomEvent('wishlistChanged'))
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        // Show user-friendly message before redirect
        if (confirm('You need to login to add items to wishlist. Would you like to login now?')) {
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
          router.push(`/login?redirect=${returnUrl}`)
        }
      } else {
        alert(error.message || 'Failed to update wishlist')
      }
    } finally {
      setLoading(false)
    }
  }

  return { inWishlist, loading, toggleWishlist }
}
