import { Suspense } from 'react'
import ScrollBanner from '@/components/ScrollBanner'
import MainNavbar from '@/components/MainNavbar'
import CartPageClient from './CartPageClient'

export default function CartPage() {
  return (
    <>
      <ScrollBanner />
      <MainNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-28 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-36">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
            <Suspense fallback={<div>Loading...</div>}>
              <CartPageClient />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}