import { Category } from '../types'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: Category | null
  onCategorySelect: (category: Category | null, slug: string | null) => void
  variant?: 'mobile' | 'desktop'
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  variant = 'desktop'
}: CategoryFilterProps) {
  if (variant === 'mobile') {
    return (
      <div className="lg:hidden bg-white rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
        <div className="flex overflow-x-auto pb-2 space-x-2">
          <button
            onClick={() => onCategorySelect(null, null)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory 
                ? 'bg-blue-100 text-blue-600 font-semibold' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-th mr-2"></i>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category, category.slug)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory?.id === category.id 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <i className={`${category.icon || 'fas fa-th'} mr-2`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="bg-white rounded-lg p-6 sticky top-6">
        <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategorySelect(null, null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !selectedCategory 
                ? 'bg-blue-100 text-blue-600 font-semibold' 
                : 'hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-th mr-2"></i>
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category, category.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory?.id === category.id 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <i className={`${category.icon || 'fas fa-th'} mr-2`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
