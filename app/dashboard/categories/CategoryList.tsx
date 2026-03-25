'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCategoryList, useDebounce } from './hooks'
import { Category } from './types'
import { UI_CONFIG } from './constants'
import CategoryCard from './components/CategoryCard'

export default function CategoryList() {
  const { categories, state, sortState, filterState, actions } = useCategoryList()
  const debouncedSearchQuery = useDebounce(state.searchQuery, UI_CONFIG.DEBOUNCE_DELAY)

  // Handle search with debounce
  const handleSearchChange = (query: string) => {
    actions.handleSearch(query)
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <i className="fas fa-list mr-2 text-blue-600" />
            Daftar Kategori ({categories.length})
          </CardTitle>
          
          {/* Quick Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <i className="fas fa-box mr-1" />
              {categories.reduce((sum: number, cat: Category) => sum + cat._count.products, 0)} produk
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari kategori..."
              value={state.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
              maxLength={UI_CONFIG.MAX_SEARCH_LENGTH}
            />
            {state.searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Urutkan:</span>
              <select
                value={`${sortState.field}-${sortState.order}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [any, 'asc' | 'desc']
                  actions.handleSort(field)
                  if (sortState.order !== order) {
                    actions.handleSort(field)
                  }
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="name-asc">Nama (A-Z)</option>
                <option value="name-desc">Nama (Z-A)</option>
                <option value="createdAt-desc">Terbaru</option>
                <option value="createdAt-asc">Terlama</option>
                <option value="productsCount-desc">Produk Terbanyak</option>
                <option value="productsCount-asc">Produk Tersedikit</option>
              </select>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2">
              <Button
                variant={filterState.hasProducts === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => actions.handleFilterByProducts(null)}
                className={`h-8 text-xs ${filterState.hasProducts === null ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                Semua
              </Button>
              <Button
                variant={filterState.hasProducts === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => actions.handleFilterByProducts(true)}
                className={`h-8 text-xs ${filterState.hasProducts === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <i className="fas fa-check-circle mr-1.5" />
                Ada Produk
              </Button>
              <Button
                variant={filterState.hasProducts === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => actions.handleFilterByProducts(false)}
                className={`h-8 text-xs ${filterState.hasProducts === false ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
              >
                <i className="fas fa-inbox mr-1.5" />
                Kosong
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center text-red-800">
              <i className="fas fa-exclamation-triangle mr-2" />
              <span className="text-sm font-medium">{state.error}</span>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              {state.searchQuery ? (
                <div className="text-gray-500">
                  <i className="fas fa-search text-3xl mb-3" />
                  <p className="text-sm">
                    Tidak ada kategori yang ditemukan untuk "{state.searchQuery}"
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearchChange('')}
                    className="mt-2"
                  >
                    <i className="fas fa-times mr-2" />
                    Hapus Filter
                  </Button>
                </div>
              ) : (
                <div className="text-gray-500">
                  <i className="fas fa-folder-open text-3xl mb-3" />
                  <p className="text-sm">Belum ada kategori</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Buat kategori pertama Anda menggunakan form di sebelah kiri
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category: Category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isEditing={state.editingId === category.id}
                  loading={state.loading}
                  onEdit={() => actions.startEdit(category.id)}
                  onSave={(data) => actions.updateCategory(category.id, data)}
                  onCancel={actions.cancelEdit}
                  onDelete={() => actions.deleteCategory(category.id)}
                  error={state.editingId === category.id ? state.error || undefined : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        {categories.length > 0 && (
          <div className="text-xs text-gray-500 text-center pt-3 border-t">
            Menampilkan {categories.length} kategori
            {state.searchQuery && ` untuk "${state.searchQuery}"`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}