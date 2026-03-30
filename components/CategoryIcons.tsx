'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(false)

  // Update scroll indicators based on scroll position
  const updateScrollIndicators = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftFade(scrollLeft > 0)
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollIndicators()
    container.addEventListener('scroll', updateScrollIndicators)
    window.addEventListener('resize', updateScrollIndicators)

    return () => {
      container.removeEventListener('scroll', updateScrollIndicators)
      window.removeEventListener('resize', updateScrollIndicators)
    }
  }, [categories])

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    let targetIndex = -1

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        targetIndex = Math.max(0, index - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        targetIndex = Math.min(categories.length - 1, index + 1)
        break
      case 'Home':
        e.preventDefault()
        targetIndex = 0
        break
      case 'End':
        e.preventDefault()
        targetIndex = categories.length - 1
        break
    }

    if (targetIndex !== -1) {
      const links = container.querySelectorAll('a')
      const targetLink = links[targetIndex] as HTMLElement
      targetLink?.focus()
      targetLink?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  return (
    <section className="bg-white py-6 mb-6" aria-label="Product categories">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Left fade indicator */}
          {showLeftFade && (
            <div 
              className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Scrollable category container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
            role="list"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((category, index) => {
              const isActive = selectedCategory === category.slug
              
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className={`
                    flex flex-col items-center gap-2 
                    min-w-[72px] p-2 rounded-lg
                    snap-start
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    active:scale-95
                    ${isActive 
                      ? 'bg-primary/10 border-2 border-primary shadow-sm' 
                      : 'border-2 border-transparent hover:bg-gray-50'
                    }
                  `}
                  aria-label={`Browse ${category.name} products`}
                  aria-current={isActive ? 'page' : undefined}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  {/* Icon container - 56x56px touch target */}
                  <div 
                    className={`
                      w-14 h-14 rounded-full 
                      flex items-center justify-center
                      transition-colors duration-300
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}
                  >
                    <i 
                      className={`${category.icon || 'fas fa-th'} text-xl`}
                      aria-hidden="true"
                    />
                  </div>
                  
                  {/* Category name */}
                  <span 
                    className={`
                      text-xs text-center leading-tight max-w-[72px]
                      ${isActive ? 'text-primary font-semibold' : 'text-gray-700'}
                    `}
                  >
                    {category.name}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Right fade indicator */}
          {showRightFade && (
            <div 
              className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Hide scrollbar globally for this component */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
