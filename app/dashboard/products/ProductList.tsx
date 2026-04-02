'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Product, Category } from './types'

// Lazy load EditProductModal - only loads when editing product
const EditProductModal = dynamic(() => import('./EditProductModal'), {
  ssr: false
})

import ProductDetailModal from './ProductDetailModal'

interface ProductListProps {
  products: Product[]
  categories: Category[]
  onViewDetails: (product: Product) => void
  onOptimisticDelete: (productIds: string[]) => void
  onOptimisticUpdate: (product: Product) => void
}

export default function ProductList({ products, categories, onViewDetails, onOptimisticDelete, onOptimisticUpdate }: ProductListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    type: 'single' | 'bulk' | 'all'
    productId?: string
    productName?: string
    count?: number
    loading?: boolean
  }>({
    open: false,
    type: 'single',
    loading: false
  })

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

  const openDeleteDialog = (type: 'single' | 'bulk' | 'all', productId?: string, productName?: string) => {
    setDeleteDialog({
      open: true,
      type,
      productId,
      productName,
      count: type === 'bulk' ? selectedProducts.size : type === 'all' ? products.length : 1
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, type: 'single' })
  }

  const confirmDelete = async () => {
    // Set loading state
    setDeleteDialog(prev => ({ ...prev, loading: true }))
    
    // Small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      let deletePromises: Promise<Response>[] = []
      let successCount = 0
      let productsToDelete: string[] = []

      if (deleteDialog.type === 'single' && deleteDialog.productId) {
        productsToDelete = [deleteDialog.productId]
        deletePromises = [fetch(`/api/products/${deleteDialog.productId}`, { method: 'DELETE' })]
      } else if (deleteDialog.type === 'bulk') {
        productsToDelete = Array.from(selectedProducts)
        deletePromises = productsToDelete.map(productId =>
          fetch(`/api/products/${productId}`, { method: 'DELETE' })
        )
      } else if (deleteDialog.type === 'all') {
        productsToDelete = products.map(p => p.id)
        deletePromises = products.map(product =>
          fetch(`/api/products/${product.id}`, { method: 'DELETE' })
        )
      }

      // OPTIMISTIC UPDATE - Update UI immediately
      onOptimisticDelete(productsToDelete)
      
      // Close dialog immediately for instant feedback
      setDeleteDialog({ open: false, type: 'single', loading: false })
      
      // Clear selection if bulk delete
      if (deleteDialog.type === 'bulk') {
        setSelectedProducts(new Set())
        setSelectMode(false)
      }
      
      // Show optimistic toast
      toast({
        title: "Produk dihapus",
        description: `${productsToDelete.length} produk telah dihapus`,
      })

      // Execute actual delete in background
      const results = await Promise.all(deletePromises)
      successCount = results.filter(r => r.ok).length
      const failedCount = results.length - successCount

      // Only show toast if there were failures
      if (failedCount > 0) {
        toast({
          title: "Sebagian produk gagal dihapus",
          description: `${successCount} berhasil, ${failedCount} gagal`,
          variant: "destructive",
        })
        // Refresh to restore failed items
        router.refresh()
      } else {
        // Refresh in background to sync with server
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menghapus produk. Silakan coba lagi.",
        variant: "destructive",
      })
      // Refresh to restore actual state
      router.refresh()
    }

    setLoading(false)
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

  return (
    <>
      <Card className="shadow-sm border border-gray-200 rounded-xl">
        <CardHeader className="bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <i className="fas fa-list text-emerald-600"></i>
              Daftar Produk
              <span className="text-sm font-normal text-gray-500">({products.length})</span>
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {!selectMode ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectMode(true)}
                    className="text-sm h-9 border-gray-300 rounded-lg"
                  >
                    <i className="fas fa-check-square mr-2"></i>
                    Select Mode
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog('all')}
                    disabled={loading || products.length === 0}
                    className="text-sm h-9 border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <i className="fas fa-trash-alt mr-2"></i>
                    Delete All
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-700 self-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium border border-emerald-200">
                    {selectedProducts.size} dipilih
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={selectAll}
                    className="text-sm h-9 border-gray-300 rounded-lg"
                  >
                    <i className="fas fa-check-double mr-2"></i>
                    Pilih Semua
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog('bulk')}
                    disabled={loading || selectedProducts.size === 0}
                    className="text-sm h-9 border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Hapus ({selectedProducts.size})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectMode(false)
                      setSelectedProducts(new Set())
                    }}
                    className="text-sm h-9 border-gray-300 rounded-lg"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Batal
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 rounded-b-xl">
          {/* Grid Layout for Product Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  className={`group relative bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    selectMode && selectedProducts.has(product.id)
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                {/* Selection Checkbox */}
                {selectMode && (
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="w-5 h-5 cursor-pointer rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={product.images?.[0] || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {product.badge && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                          {product.badge}
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">HABIS</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                          {product.category.name}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                          <i className="fas fa-star"></i>
                          <span className="text-gray-600">{product.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-base font-bold text-emerald-600 whitespace-nowrap">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through whitespace-nowrap">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <i className="fas fa-box text-gray-400"></i>
                            {product.stock}
                          </span>
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <i className="fas fa-shopping-cart text-gray-400"></i>
                            {product.sold}
                          </span>
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <i className="fas fa-images text-gray-400"></i>
                            {product.images?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!selectMode && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex gap-2 mt-4 pt-4 border-t border-gray-100"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewDetails(product)}
                          className="w-full text-sm h-9 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <i className="fas fa-eye mr-1.5"></i>
                          Lihat
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(product)}
                          className="w-full text-sm h-9 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <i className="fas fa-edit mr-1.5"></i>
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteDialog('single', product.id, product.name)}
                          disabled={loading}
                          className="w-full text-sm h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <i className="fas fa-trash mr-1.5"></i>
                          Hapus
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {products.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <i className="fas fa-box text-4xl text-gray-400"></i>
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Produk</h3>
              <p className="text-sm text-gray-500">Mulai tambahkan produk pertama Anda</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={(updatedProduct) => {
            setEditingProduct(null)
            if (updatedProduct) {
              onOptimisticUpdate(updatedProduct)
            }
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              {deleteDialog.loading ? (
                <i className="fas fa-spinner fa-spin text-3xl text-red-600"></i>
              ) : (
                <i className="fas fa-trash-alt text-3xl text-red-600"></i>
              )}
            </div>
            <AlertDialogTitle className="text-center text-xl">
              {deleteDialog.loading ? (
                'Menghapus Produk...'
              ) : (
                <>
                  {deleteDialog.type === 'single' && 'Hapus Produk?'}
                  {deleteDialog.type === 'bulk' && `Hapus ${deleteDialog.count} Produk?`}
                  {deleteDialog.type === 'all' && `Hapus Semua Produk?`}
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {deleteDialog.loading ? (
                <span className="text-gray-600">
                  Mohon tunggu, sedang menghapus produk...
                </span>
              ) : (
                <>
                  {deleteDialog.type === 'single' && (
                    <>
                      Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-gray-900">"{deleteDialog.productName}"</span>?
                      <br />
                      <span className="text-red-600 font-medium mt-2 block">Tindakan ini tidak dapat dibatalkan.</span>
                    </>
                  )}
                  {deleteDialog.type === 'bulk' && (
                    <>
                      Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-900">{deleteDialog.count} produk</span> yang dipilih?
                      <br />
                      <span className="text-red-600 font-medium mt-2 block">Semua gambar produk juga akan dihapus.</span>
                    </>
                  )}
                  {deleteDialog.type === 'all' && (
                    <>
                      <span className="text-red-600 font-bold block mb-2">⚠️ PERINGATAN!</span>
                      Anda akan menghapus <span className="font-semibold text-gray-900">SEMUA {deleteDialog.count} produk</span> beserta gambarnya.
                      <br />
                      <span className="text-red-600 font-medium mt-2 block">Tindakan ini TIDAK DAPAT dibatalkan!</span>
                    </>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-3 mt-6">
            <button
              type="button"
              onClick={closeDeleteDialog}
              disabled={deleteDialog.loading}
              className="flex-1 inline-flex h-11 items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-times mr-2"></i>
              Batal
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={deleteDialog.loading}
              className="flex-1 inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/30"
            >
              {deleteDialog.loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Menghapus...
                </>
              ) : (
                <>
                  <i className="fas fa-trash mr-2"></i>
                  Ya, Hapus
                </>
              )}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
