'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from './types'
import { X, GripVertical } from 'lucide-react'

export default function CreateProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: categories[0]?.id || '',
    stock: '0',
    badge: ''
  })

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setImageFiles(prev => [...prev, ...newFiles])
    
    // Generate previews
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let finalImageUrls: string[] = []

      // Upload images if files are selected
      if (imageMode === 'upload' && imageFiles.length > 0) {
        finalImageUrls = await uploadImagesToSupabase(imageFiles)
      } else if (imageMode === 'url') {
        finalImageUrls = imageUrls
      }

      if (finalImageUrls.length === 0) {
        setError('Please add at least one image')
        setLoading(false)
        return
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          images: finalImageUrls // Send as array
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Product created successfully!')
        setFormData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          categoryId: categories[0]?.id || '',
          stock: '0',
          badge: ''
        })
        setImageFiles([])
        setImagePreviews([])
        setImageUrls([])
        router.refresh()
      } else {
        setError(result.message || 'Failed to create product')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat membuat produk.')
    }

    setLoading(false)
  }

  const displayImages = imageMode === 'upload' ? imagePreviews : imageUrls

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Produk Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nama Produk
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Laptop Gaming ROG"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Kategori
              </label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Harga (Rp)
              </label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 15000000"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="originalPrice" className="text-sm font-medium">
                Harga Asli (Optional)
              </label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="e.g. 20000000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">
                Stok
              </label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="e.g. 100"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="badge" className="text-sm font-medium">
                Badge (Optional)
              </label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. HOT, NEW, -50%"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Gambar Produk (Multiple)
            </label>
            
            {/* Image Mode Toggle */}
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
              <div className="space-y-2">
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
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                    <p className="text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB (Multiple files)</p>
                  </div>
                </label>
              </div>
            )}

            {/* Image Previews */}
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
            <label htmlFor="description" className="text-sm font-medium">
              Deskripsi
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Product description..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Buat Produk'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
