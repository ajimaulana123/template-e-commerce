export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  images: string[] // Changed from image to images array
  stock: number
  sold: number
  rating: number
  totalReviews: number
  badge: string | null
  category: {
    id: string
    name: string
  }
}

export interface Category {
  id: string
  name: string
  icon: string | null
  slug: string
}

export interface ProductsPageClientProps {
  categorySlug?: string
}
