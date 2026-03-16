import { Suspense } from 'react'
import ScrollBanner from '@/components/ScrollBanner'
import MainNavbar from '@/components/MainNavbar'
import ProductDetailClient from './ProductDetailClient'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params

  return (
    <>
      <ScrollBanner />
      <MainNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-28 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-36">
          <div className="container mx-auto px-4">
            <Suspense fallback={<div>Loading...</div>}>
              <ProductDetailClient productId={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}