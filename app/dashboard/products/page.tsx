import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import ProductsPageClient from './ProductsPageClient'

export default async function ProductsPage() {
  const session = await verifySession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const products = await prisma.product.findMany({
    include: { 
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Product Management</h1>
        <ProductsPageClient products={products} categories={categories} />
      </div>
    </div>
  )
}
