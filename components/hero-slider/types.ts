export interface MainSlide {
  id: number
  title: string
  subtitle: string
  hashtag: string
  description: string
  period: string
  bgColor: string
  image: string
  cta: string
  link: string
}

export interface FeaturedProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export interface FlashSaleProduct extends FeaturedProduct {
  originalPrice: number
  discount: number
}

export interface BestSellerProduct extends FeaturedProduct {
  sold: number
}

export interface NewArrivalProduct extends FeaturedProduct {
  createdAt: string
}

export interface FeaturedProductsResponse {
  flashSale: FlashSaleProduct | null
  bestSeller: BestSellerProduct | null
  newArrival: NewArrivalProduct | null
}
