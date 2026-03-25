'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product, Category } from './types'

// Lazy load EditProductModal - only loads when editing product
const EditProductModal = dynamic(() => import('./EditProductModal'), {
  ssr: false
})

interface ProductListProps {
  products: Product[]
  categories: Category[]
  onViewDetails: (product: Product) => void
}

export default function ProductList({ products, categories, onViewDetails }: ProductListProps) {
  const router = useRouter()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const toggleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  const selectAll = () => {
    setSelectedProducts(new Set(products.map(p => p.id)))
  }

  const deselectAll = () => {
    setSelectedProducts(new Set())
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select products to delete')
      return
    }

    const count = selectedProducts.size
    if (!confirm(`Are you sure you want to delete ${count} product(s)? This will also delete all their images from storage.`)) {
      return
    }

    setLoading(true)

    try {
      const deletePromises = Array.from(selectedProducts).map(productId =>
        fetch(`/api/products/${productId}`, { method: 'DELETE' })
      )

      const results = await Promise.all(deletePromises)
      const failed = results.filter(r => !r.ok).length

      if (failed > 0) {
        alert(`Deleted ${count - failed} products. ${failed} failed.`)
      } else {
        alert(`Successfully deleted ${count} product(s)`)
      }

      setSelectedProducts(new Set())
      setSelectMode(false)
      router.refresh()
    } catch (error) {
      alert('Error deleting products')
    }

    setLoading(false)
  }

  const handleDeleteAll = async () => {
    if (products.length === 0) {
      alert('No products to delete')
      return
    }

    if (!confirm(`⚠️ WARNING: This will delete ALL ${products.length} products and their images from storage. This action cannot be undone. Are you absolutely sure?`)) {
      return
    }

    // Double confirmation
    if (!confirm(`This is your last chance. Delete ALL ${products.length} products?`)) {
      return
    }

    setLoading(true)

    try {
      const deletePromises = products.map(product =>
        fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      )

      const results = await Promise.all(deletePromises)
      const failed = results.filter(r => !r.ok).length

      if (failed > 0) {
        alert(`Deleted ${products.length - failed} products. ${failed} failed.`)
      } else {
        alert(`Successfully deleted all ${products.length} products`)
      }

      router.refresh()
    } catch (error) {
      alert('Error deleting products')
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

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus produk.')
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Produk ({products.length})</CardTitle>
            <div className="flex gap-2">
              {!selectMode ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectMode(true)}
                  >
                    <i className="fas fa-check-square mr-2"></i>
                    Select Mode
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteAll}
                    disabled={loading || products.length === 0}
                  >
                    <i className="fas fa-trash-alt mr-2"></i>
                    Delete All
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600 self-center">
                    {selectedProducts.size} selected
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={selectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={deselectAll}
                  >
                    Deselect All
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={loading || selectedProducts.size === 0}
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Delete ({selectedProducts.size})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectMode(false)
                      setSelectedProducts(new Set())
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`p-4 rounded-lg space-y-3 ${
                  selectMode && selectedProducts.has(product.id)
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                  )}
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product.category.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      {product.badge && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                      <span>Stock: {product.stock}</span>
                      <span>Sold: {product.sold}</span>
                      <span>Rating: {product.rating.toFixed(1)}</span>
                      <span>Images: {product.images?.length || 0}</span>
                    </div>
                  </div>
                  {!selectMode && (
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(product)}
                      >
                        <i className="fas fa-eye mr-2"></i>
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={loading}
                      >
                        <i className="fas fa-trash mr-2"></i>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-box text-4xl mb-4"></i>
                <p>Belum ada produk</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
