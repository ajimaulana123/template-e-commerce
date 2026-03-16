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
      {/* Current Selection */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <i className={`${value} text-blue-600`} />
        </div>
        <div>
          <p className="text-sm font-medium">Icon Terpilih</p>
          <p className="text-xs text-gray-600">{value}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Cari icon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={disabled}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={disabled}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Icon Grid */}
      <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filteredIcons.map((icon) => (
            <button
              key={icon.value}
              type="button"
              onClick={() => onChange(icon.value)}
              disabled={disabled}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-all
                hover:bg-blue-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:cursor-not-allowed disabled:opacity-50
                ${value === icon.value 
                  ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' 
                  : 'bg-gray-50 text-gray-600 hover:text-blue-600'
                }
              `}
              title={icon.label}
            >
              <i className={icon.value} />
            </button>
          ))}
        </div>
        
        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-search text-2xl mb-2" />
            <p className="text-sm">Tidak ada icon yang ditemukan</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <i className="fas fa-exclamation-circle mr-1" />
          {error}
        </p>
      )}

      {/* Icon Count */}
      <p className="text-xs text-gray-500 text-center">
        Menampilkan {filteredIcons.length} dari {DEFAULT_ICONS.length} icon
      </p>
    </div>
  )
}