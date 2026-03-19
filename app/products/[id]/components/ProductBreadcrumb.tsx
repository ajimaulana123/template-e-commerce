import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface ProductBreadcrumbProps {
  categoryId: string
  categoryName: string
  productName: string
}

export function ProductBreadcrumb({ categoryId, categoryName, productName }: ProductBreadcrumbProps) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Link href="/" className="hover:text-blue-600">Home</Link>
      <ChevronLeft className="w-4 h-4 rotate-180" />
      <Link href="/products" className="hover:text-blue-600">Products</Link>
      <ChevronLeft className="w-4 h-4 rotate-180" />
      <Link href={`/products?category=${categoryId}`} className="hover:text-blue-600">
        {categoryName}
      </Link>
      <ChevronLeft className="w-4 h-4 rotate-180" />
      <span className="text-gray-900 font-medium truncate">{productName}</span>
    </div>
  )
}
