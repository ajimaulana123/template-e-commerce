'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEFAULT_ICONS, ICON_CATEGORIES } from '../constants'
import { IconOption } from '../types'

interface IconSelectorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export default function IconSelector({ value, onChange, error, disabled }: IconSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    return DEFAULT_ICONS.filter(icon => {
      const matchesSearch = searchQuery === '' || 
        icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.value.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || 
        icon.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(DEFAULT_ICONS.map(icon => icon.category)))
    return [{ value: 'all', label: 'Semua Kategori' }].concat(
      uniqueCategories.map(cat => ({ value: cat, label: cat }))
    )
  }, [])

  return (
    <div className="space-y-3">
      {/* Current Selection & Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className={`${value} text-blue-600 text-lg`} />
          </div>
          <Input
            placeholder="Cari icon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={disabled}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Icon Grid */}
      <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-gray-50">
        {filteredIcons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-search text-2xl mb-2" />
            <p className="text-sm">Tidak ada icon yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
            {filteredIcons.map((icon) => (
              <button
                key={icon.value}
                type="button"
                onClick={() => onChange(icon.value)}
                disabled={disabled}
                className={`
                  w-9 h-9 rounded-md flex items-center justify-center transition-all
                  hover:bg-blue-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:cursor-not-allowed disabled:opacity-50
                  ${value === icon.value 
                    ? 'bg-blue-500 text-white ring-2 ring-blue-500' 
                    : 'bg-white text-gray-600 hover:text-blue-600'
                  }
                `}
                title={icon.label}
              >
                <i className={icon.value} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 flex items-center">
          <i className="fas fa-exclamation-circle mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}