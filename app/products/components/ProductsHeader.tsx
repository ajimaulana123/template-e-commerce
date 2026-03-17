import { Input } from '@/components/ui/input'
import { Category } from '../types'

interface ProductsHeaderProps {
  selectedCategory: Category | null
  productsCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function ProductsHeader({ 
  selectedCategory, 
  productsCount, 
  searchQuery, 
  onSearchChange 
}: ProductsHeaderProps) {
  return (
    <div className="bg-white rounded-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            {selectedCategory ? selectedCategory.name : 'All Products'}
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            {productsCount} products found
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full lg:w-64"
          />
        </div>
      </div>
    </div>
  )
}
