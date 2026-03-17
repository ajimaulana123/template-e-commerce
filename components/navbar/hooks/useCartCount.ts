import { useState, useEffect } from 'react'
import { getCart } from '@/lib/cart'

export const useCartCount = () => {
  const [cartCount, setCartCount] = useState(0)

  const fetchCartCount = async () => {
    try {
      const cart = await getCart()
      if (cart) {
        const count = cart.reduce((total: number, item: any) => total + item.quantity, 0)
        setCartCount(count)
      }
    } catch (error) {
      setCartCount(0)
    }
  }

  useEffect(() => {
    fetchCartCount()

    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  return cartCount
}
