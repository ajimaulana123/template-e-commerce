'use client'

import Link from 'next/link'

interface Category {
  id: string
  name: string
  icon: string | null
  slug: string
}

interface CategoryIconsProps {
  categories: Category[]
}

export default function CategoryIcons({ categories }: CategoryIconsProps) {
  return (
    <section className="bg-white py-6 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="flex flex-col items-center space-y-2 min-w-[80px] hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <i className={`${category.icon || 'fas fa-th'} text-xl text-gray-600`}></i>
              </div>
              <span className="text-xs text-gray-700 text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
