'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { Product, Category } from './types'

interface EditProductModalProps {
  product: Product
  categories: Category[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditProductModal({ 
  product, 
  categories, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price.toString(),
    originalPrice: product.originalPrice?.toString() || '',
    categoryId: product.categoryId,
    stock: product.stock.toString(),
    badge: product.badge || ''
  })

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setImageUrls(product.images)
    }
  }, [product])

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setImageFiles(prev => [...prev, ...newFiles])
    
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    if (imageMode === 'upload') {
      setImageFiles(prev => prev.filter((_, i) => i !== index))
      setImagePreviews(prev => prev.filter((_, i) => i !== index))
    } else {
      setImageUrls(prev => prev.filter((_, i) => i !== index))
    }
  }

  const addUrlImage = () => {
    if (currentUrl.trim()) {
      setImageUrls(prev => [...prev, currentUrl.trim()])
      setCurrentUrl('')
    }
  }

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')
      
      const data = await response.json()
      return data.url
    })

    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let finalImageUrls: string[] = imageUrls

      // Upload new images if files are selected
      if (imageMode === 'upload' && imageFiles.length > 0) {
        const newUrls = await uploadImagesToSupabase(imageFiles)
        finalImageUrls = [...imageUrls, ...newUrls]
      }

      if (finalImageUrls.length === 0) {
        setError('Please add at least one image')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          images: finalImageUrls
        })
      })

      const result = await response.json()

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        setError(result.message || 'Failed to update product')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat update produk.')
    }

    setLoading(false)
  }

  if (!isOpen) return null

  const displayImages = imageMode === 'upload' 
    ? [...imageUrls, ...imagePreviews]
    : imageUrls

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Produk</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Harga (Rp)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Harga Asli (Optional)</label>
              <Input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stok</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Badge (Optional)</label>
              <Input
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gambar Produk (Multiple)</label>
            
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                size="sm"
                variant={imageMode === 'url' ? 'default' : 'outline'}
                onClick={() => setImageMode('url')}
              >
                <i className="fas fa-link mr-2"></i>URL
              </Button>
              <Button
                type="button"
                size="sm"
                variant={imageMode === 'upload' ? 'default' : 'outline'}
                onClick={() => setImageMode('upload')}
              >
                <i className="fas fa-upload mr-2"></i>Upload
              </Button>
            </div>

            {imageMode === 'url' ? (
              <div className="flex gap-2">
                <Input
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addUrlImage()
                    }
                  }}
                />
                <Button type="button" onClick={addUrlImage}>
                  Add
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload-edit"
                />
                <label htmlFor="image-upload-edit" className="cursor-pointer">
                  <div className="text-gray-600">
                    <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                    <p className="text-sm">Click to upload more images</p>
                  </div>
                </label>
              </div>
            )}

            {displayImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">
                  Images ({displayImages.length}):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {displayImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
