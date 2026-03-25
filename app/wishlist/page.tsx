import { Suspense } from 'react'
import WishlistPageClient from './WishlistPageClient'

export const metadata = {
  title: 'My Wishlist',
  description: 'View your saved products'
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WishlistPageClient />
    </Suspense>
  )
}
