export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string
  stock: number
  sold: number
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
