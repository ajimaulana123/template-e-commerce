import { Suspense } from 'react'
import ScrollBanner from '@/components/ScrollBanner'
import MainNavbar from '@/components/MainNavbar'
import ProductsPageClient from './ProductsPageClient'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: categorySlug } = await searchParams

  return (
    <>
      <ScrollBanner />
      <MainNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-28 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-36">
          <div className="container mx-auto px-4">
            <Suspense fallback={<div>Loading...</div>}>
              <ProductsPageClient categorySlug={categorySlug} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}