import { useState, useEffect } from 'react'

export function useWishlistCount() {
  const [wishlistCount, setWishlistCount] = useState(0)

  const fetchWishlistCount = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const wishlistItems = await response.json()
        setWishlistCount(wishlistItems.length)
      } else {
        setWishlistCount(0)
      }
    } catch (error) {
      setWishlistCount(0)
    }
  }

  useEffect(() => {
    fetchWishlistCount()

    // Listen for wishlist changes
    const handleWishlistChange = () => {
      fetchWishlistCount()
    }

    window.addEventListener('wishlistChanged', handleWishlistChange)
    
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange)
    }
  }, [])

  return wishlistCount
}