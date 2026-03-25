import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Product {
  id?: string
  name: string
  price: string
  originalPrice?: string
  image?: string
  images?: string[]
  rating?: number
  sold?: string
  badge?: string
}

interface ProductGridProps {
  title: string
  icon?: string
  products: Product[]
  columns?: number
}

export default function ProductGrid({ title, icon, products, columns = 4 }: ProductGridProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          {icon && <i className={`${icon} mr-2 text-blue-600`}></i>}
          {title}
        </h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Lihat Semua <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </a>
      </div>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-3`}>
        {products.map((product, i) => {
          const ProductCard = (
            <Card key={i} className="hover:shadow-md transition-all cursor-pointer group border border-gray-200">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden bg-gray-50 h-48">
                  <Image 
                    src={product.images?.[0] || '/placeholder.png'} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                      {product.badge}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <CardTitle className="text-sm mb-2 line-clamp-2 h-10 text-gray-800">{product.name}</CardTitle>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }, (_, j) => (
                    <i key={j} className={`fas fa-star text-xs ${j < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                  ))}
                  {product.sold && (
                    <span className="text-xs text-gray-500 ml-2">({product.sold})</span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-base font-bold text-gray-900">{product.price}</div>
                  {product.originalPrice && (
                    <div className="text-xs text-gray-500 line-through">{product.originalPrice}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )

          // If product has ID, wrap with Link, otherwise return as is
          return product.id ? (
            <Link key={i} href={`/products/${product.id}`}>
              {ProductCard}
            </Link>
          ) : ProductCard
        })}
      </div>
    </section>
  )
}
