import { Suspense } from 'react'
import WishlistPageClient from './WishlistPageClient'

export const metadata = {
  title: 'My Wishlist',
  description: 'View your saved products'
}

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <WishlistPageClient />
        </Suspense>
      </div>
    </div>
  )
}
