import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  images: string[] // Changed from image to images
  stock: number
  sold: number
  rating: number
  totalReviews: number
  badge: string | null
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
  }
}

export function useProductDetail(productId: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      setLoadingRelated(true)
      
      const [relatedResponse, frequentResponse] = await Promise.all([
        fetch(`/api/products/${productId}/related`),
        fetch(`/api/products/${productId}/frequently-bought`)
      ])

      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json()
        setRelatedProducts(relatedData)
      }

      if (frequentResponse.ok) {
        const frequentData = await frequentResponse.json()
        setFrequentlyBought(frequentData)
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoadingRelated(false)
    }
  }

  return {
    product,
    loading,
    relatedProducts,
    frequentlyBought,
    loadingRelated
  }
}
