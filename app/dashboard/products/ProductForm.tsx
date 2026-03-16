'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from './types'

export default function CreateProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    categoryId: categories[0]?.id || '',
    stock: '0',
    badge: ''
  })

  const handleImageUpload = async (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/products/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Failed to upload image')
    
    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let imageUrl = formData.image

      // Upload image if file is selected
      if (imageFile && imageMode === 'upload') {
        imageUrl = await uploadImageToSupabase(imageFile)
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imageUrl })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Product created successfully!')
        setFormData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          image: '',
          categoryId: categories[0]?.id || '',
          stock: '0',
          badge: ''
        })
        setImageFile(null)
        setImagePreview('')
        router.refresh()
      } else {
        setError(result.message || 'Failed to create product')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat membuat produk.')
    }

    setLoading(false)
  }

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
            <label className="text-sm font-medium">Gambar Produk</label>
            
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
              <Input
                required={!imageFile}
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value })
                  setImagePreview(e.target.value)
                }}
                placeholder="https://images.unsplash.com/..."
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <i className="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                    <p className="text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">
                    <i className="fas fa-check-circle mr-1"></i>
                    {imageFile.name}
                  </p>
                )}
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
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
