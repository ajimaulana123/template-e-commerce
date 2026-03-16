'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product, Category } from './types'

interface ProductListProps {
  products: Product[]
  categories: Category[]
  onViewDetails: (product: Product) => void
}

export default function ProductList({ products, categories, onViewDetails }: ProductListProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    stock: '',
    badge: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      categoryId: product.categoryId,
      stock: product.stock.toString(),
      badge: product.badge || ''
    })
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      stock: '',
      badge: ''
    })
    setError('')
  }

  const handleSaveEdit = async (productId: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      const result = await response.json()

      if (response.ok) {
        setEditingId(null)
        router.refresh()
      } else {
        setError(result.message || 'Failed to update product')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat update produk.')
    }

    setLoading(false)
  }

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        router.refresh()
      } else {
        alert(result.message || 'Failed to delete product')
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus produk.')
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Produk ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {products.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Belum ada produk
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-gray-50 rounded-lg space-y-3"
              >
                {editingId === product.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    {error && (
                      <div className="bg-destructive/10 text-destructive text-xs p-2 rounded">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium">Nama Produk</label>
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">Kategori</label>
                        <select
                          value={editData.categoryId}
                          onChange={(e) => setEditData({ ...editData, categoryId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium">Harga (Rp)</label>
                        <Input
                          type="number"
                          value={editData.price}
                          onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">Harga Asli (Optional)</label>
                        <Input
                          type="number"
                          value={editData.originalPrice}
                          onChange={(e) => setEditData({ ...editData, originalPrice: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">Stok</label>
                        <Input
                          type="number"
                          value={editData.stock}
                          onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">Badge</label>
                        <Input
                          value={editData.badge}
                          onChange={(e) => setEditData({ ...editData, badge: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium">Deskripsi</label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-1"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(product.id)}
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-start space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-blue-600">{product.category.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          {product.badge && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                          <span><i className="fas fa-box mr-1"></i>Stock: {product.stock}</span>
                          <span><i className="fas fa-shopping-cart mr-1"></i>Sold: {product.sold}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(product)}
                        disabled={loading}
                        className="flex-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <i className="fas fa-eye mr-1"></i>View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        disabled={loading}
                        className="flex-1 text-xs"
                      >
                        <i className="fas fa-edit mr-1"></i>Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={loading}
                        className="flex-1 text-xs"
                      >
                        <i className="fas fa-trash mr-1"></i>Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
