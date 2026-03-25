import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: {
    name: string
  }
}

export const useProductSearch = (query: string, enabled: boolean = true) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled || !query || query.length < 2) {
      setProducts([])
      return
    }

    const searchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
        
        if (response.ok) {
          const data = await response.json()
          // Handle both old format (array) and new format (object with products array)
          const productsArray = Array.isArray(data) ? data : data.products || []
          setProducts(productsArray.slice(0, 5)) // Limit to 5 results
        }
      } catch (error) {
        // Silent fail
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [query, enabled])

  return { products, loading }
}
