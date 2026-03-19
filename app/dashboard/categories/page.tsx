import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import CategoriesPageClient from './CategoriesPageClient'

export default async function CategoriesPage() {
  const session = await verifySession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/')
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Category Management</h1>
        <CategoriesPageClient categories={categories} />
      </div>
    </div>
  )
}
