import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Product {
  id?: string
  name: string
  price: string
  originalPrice?: string
  image: string
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
    <section className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          {icon && <i className={`${icon} mr-3 text-blue-600`}></i>}
          {title}
        </h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
          Lihat Semua <i className="fas fa-chevron-right ml-1"></i>
        </a>
      </div>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4`}>
        {products.map((product, i) => {
          const ProductCard = (
            <Card key={i} className="hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.images?.[0] || '/placeholder.png'} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {product.badge}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <CardTitle className="text-sm mb-2 line-clamp-2 h-10">{product.name}</CardTitle>
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }, (_, j) => (
                    <i key={j} className={`fas fa-star text-xs ${j < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                  ))}
                  {product.sold && (
                    <span className="text-xs text-gray-500 ml-2">({product.sold})</span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-gray-900">{product.price}</div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">{product.originalPrice}</div>
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
