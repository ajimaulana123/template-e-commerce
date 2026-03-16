'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Category, UpdateCategoryData, CategoryFormErrors } from '../types'
import { ERROR_MESSAGES } from '../constants'
import IconSelector from './IconSelector'

interface CategoryCardProps {
  category: Category
  isEditing: boolean
  loading: boolean
  onEdit: () => void
  onSave: (data: UpdateCategoryData) => Promise<boolean>
  onCancel: () => void
  onDelete: () => void
  error?: string
}

export default function CategoryCard({
  category,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  error
}: CategoryCardProps) {
  const [editData, setEditData] = useState<UpdateCategoryData>({
    id: category.id,
    name: category.name,
    icon: category.icon || 'fas fa-th',
    slug: category.slug
  })
  const [localErrors, setLocalErrors] = useState<CategoryFormErrors>({})

  // Handle form changes
  const handleChange = (field: keyof UpdateCategoryData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    
    // Clear local errors when user types
    if (localErrors[field as keyof CategoryFormErrors]) {
      setLocalErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle save
  const handleSave = async () => {
    const success = await onSave(editData)
    if (!success) {
      // Focus on first error field
      const firstErrorField = Object.keys(localErrors)[0]
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
        element?.focus()
      }
    }
  }

  // Handle delete with confirmation
  const handleDelete = () => {
    const hasProducts = category._count.products > 0
    const message = hasProducts 
      ? `${ERROR_MESSAGES.DELETE_CONFIRMATION}\n\n${ERROR_MESSAGES.DELETE_WITH_PRODUCTS}`
      : ERROR_MESSAGES.DELETE_CONFIRMATION
    
    if (confirm(message)) {
      onDelete()
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4 shadow-sm">
        {/* Error Display */}
        {(error || Object.keys(localErrors).length > 0) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center text-red-800">
              <i className="fas fa-exclamation-triangle mr-2" />
              <span className="text-sm font-medium">Terjadi Kesalahan</span>
            </div>
            {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
            {Object.values(localErrors).map((err, idx) => (
              <p key={idx} className="text-sm text-red-700 mt-1">{err}</p>
            ))}
          </div>
        )}

        {/* Edit Form */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kategori
            </label>
            <Input
              name="name"
              value={editData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Masukkan nama kategori"
              disabled={loading}
              className={localErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            />
            {localErrors.name && (
              <p className="text-sm text-red-600 mt-1">{localErrors.name}</p>
            )}
          </div>

          {/* Slug Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <Input
              name="slug"
              value={editData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="slug-kategori"
              disabled={loading}
              className={`font-mono text-sm ${localErrors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {localErrors.slug && (
              <p className="text-sm text-red-600 mt-1">{localErrors.slug}</p>
            )}
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <IconSelector
              value={editData.icon}
              onChange={(value) => handleChange('icon', value)}
              error={localErrors.icon}
              disabled={loading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1"
            size="sm"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2" />
                Simpan
              </>
            )}
          </Button>
          <Button
            onClick={onCancel}
            disabled={loading}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <i className="fas fa-times mr-2" />
            Batal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 group">
      {/* Category Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className={`${category.icon || 'fas fa-th'} text-blue-600 text-lg`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
            <p className="text-sm text-gray-500 font-mono">{category.slug}</p>
          </div>
        </div>
        
        {/* Product Count Badge */}
        <div className={`
          px-2 py-1 rounded-full text-xs font-medium flex-shrink-0
          ${category._count.products > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          {category._count.products} produk
        </div>
      </div>

      {/* Category Meta */}
      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <div className="flex items-center">
          <i className="fas fa-calendar-alt mr-2 w-3" />
          Dibuat: {new Date(category.createdAt).toLocaleDateString('id-ID')}
        </div>
        {category.updatedAt !== category.createdAt && (
          <div className="flex items-center">
            <i className="fas fa-edit mr-2 w-3" />
            Diperbarui: {new Date(category.updatedAt).toLocaleDateString('id-ID')}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onEdit}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <i className="fas fa-edit mr-2" />
          Edit
        </Button>
        <Button
          onClick={handleDelete}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <i className="fas fa-trash mr-2" />
          Hapus
        </Button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center text-gray-600">
            <i className="fas fa-spinner fa-spin mr-2" />
            <span className="text-sm">Memproses...</span>
          </div>
        </div>
      )}
    </div>
  )
}