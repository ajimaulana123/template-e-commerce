'use client'

import { X } from 'lucide-react'

interface SearchDropdownProps {
  isOpen: boolean
  searchQuery: string
  onClose: () => void
  onSearchChange: (value: string) => void
}

export default function SearchDropdown({ isOpen, searchQuery, onClose, onSearchChange }: SearchDropdownProps) {
  const popularSearches = [
    'kaca mata',
    'poles',
    'dashcam',
    'masker',
    'solar',
    'micro sd',
    'sikat'
  ]

  const recentSearches = [
    'Toplas Kue'
  ]

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-w-3xl mx-auto">
      <div className="p-6">
        {/* Popular Searches */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Pencarian Populer</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => onSearchChange(term)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Terakhir Dicari</h3>
            <div className="space-y-2">
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <button
                    onClick={() => onSearchChange(term)}
                    className="flex-1 text-left text-gray-700 text-sm"
                  >
                    {term}
                  </button>
                  <button
                    onClick={() => {
                      // Remove from recent searches
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}