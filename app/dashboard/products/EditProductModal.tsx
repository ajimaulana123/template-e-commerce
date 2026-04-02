'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { X } from 'lucide-react'
import { Product, Category } from './types'
import imageCompression from 'browser-image-compression'

interface EditProductModalProps {
  product: Product | null
  categories: Category[]
  isOpen: boolean
  onClose: () => void
  onSuccess: (product?: Product) => void
}

export default function EditProductModal({ 
  product, 
  categories, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditProductModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [isCompressing, setIsCompressing] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    categoryId: product?.categoryId || categories[0]?.id || '',
    stock: product?.stock.toString() || '0',
    badge: product?.badge || ''
  })

  // Format number with thousand separator
  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, '')
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Parse formatted number back to plain number
  const parseNumber = (value: string) => {
    return value.replace(/\./g, '')
  }

  const handleNumberChange = (field: 'price' | 'originalPrice' | 'stock', value: string) => {
    const plainNumber = parseNumber(value)
    setFormData({ ...formData, [field]: plainNumber })
  }

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setImageUrls(product.images)
    } else {
      setImageUrls([])
    }
    
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        categoryId: product.categoryId,
        stock: product.stock.toString(),
        badge: product.badge || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        categoryId: categories[0]?.id || '',
        stock: '0',
        badge: ''
      })
    }
  }, [product, categories])

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type
    }
    
    try {
      const compressedFile = await imageCompression(file, options)
      return compressedFile
    } catch (error) {
      console.error('Error compressing image:', error)
      return file // Return original if compression fails
    }
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return
    
    setIsCompressing(true)
    const newFiles = Array.from(files)
    
    try {
      // Compress images in parallel
      const compressedFiles = await Promise.all(
        newFiles.map(file => compressImage(file))
      )
      
      setImageFiles(prev => [...prev, ...compressedFiles])
      
      compressedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
      
      toast({
        title: "Gambar berhasil dikompresi",
        description: `${compressedFiles.length} gambar siap diupload`,
      })
    } catch (error) {
      toast({
        title: "Gagal memproses gambar",
        description: "Silakan coba lagi",
        variant: "destructive",
      })
    } finally {
      setIsCompressing(false)
    }
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
    const uploadPromises = files.map(async (file, index) => {
      const formData = new FormData()
      formData.append('file', file)

      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
            resolve(data.url)
          } else {
            reject(new Error('Upload failed'))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'))
        })

        xhr.open('POST', '/api/products/upload')
        xhr.send(formData)
      })
    })

    const results = await Promise.all(uploadPromises)
    setUploadProgress({}) // Reset progress after all uploads complete
    return results
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi form
    if (!formData.name.trim()) {
      toast({
        title: "Nama produk diperlukan",
        description: "Silakan masukkan nama produk",
        variant: "destructive",
      })
      return
    }

    if (!formData.price || formData.price === '0') {
      toast({
        title: "Harga diperlukan",
        description: "Silakan masukkan harga produk",
        variant: "destructive",
      })
      return
    }

    if (!formData.stock) {
      toast({
        title: "Stok diperlukan",
        description: "Silakan masukkan jumlah stok produk",
        variant: "destructive",
      })
      return
    }

    if (!formData.categoryId) {
      toast({
        title: "Kategori diperlukan",
        description: "Silakan pilih kategori produk",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      let finalImageUrls: string[] = imageUrls

      // Upload new images if files are selected
      if (imageMode === 'upload' && imageFiles.length > 0) {
        const newUrls = await uploadImagesToSupabase(imageFiles)
        finalImageUrls = [...imageUrls, ...newUrls]
      }

      if (finalImageUrls.length === 0) {
        toast({
          title: "Gambar diperlukan",
          description: "Silakan tambahkan minimal satu gambar produk",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          images: finalImageUrls
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Close modal immediately
        onClose()
        
        // Pass the result to parent for optimistic update
        onSuccess(result)
        
        // Show success toast
        toast({
          title: product ? "Produk berhasil diperbarui" : "Produk berhasil dibuat",
          description: product ? "Perubahan produk telah disimpan" : "Produk baru telah ditambahkan",
        })
        
        // Refresh in background to sync with server
        router.refresh()
      } else {
        toast({
          title: "Gagal menyimpan produk",
          description: result.message || "Terjadi kesalahan saat menyimpan produk",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: `Gagal ${product ? 'memperbarui' : 'membuat'} produk. Silakan coba lagi.`,
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  if (!isOpen) return null

  const displayImages = imageMode === 'upload' 
    ? [...imageUrls, ...imagePreviews]
    : imageUrls

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white">
              {product ? 'Edit Product' : 'Tambah Produk Baru'}
            </h2>
            <p className="text-emerald-100 text-sm mt-0.5">
              {product ? 'Perbarui informasi produk' : 'Isi detail produk baru'}
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-tag text-emerald-600"></i>
                Nama Produk
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama produk"
                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-folder text-emerald-600"></i>
                Kategori
              </label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-money-bill-wave text-emerald-600"></i>
                Harga (Rp)
              </label>
              <Input
                id="price"
                type="text"
                value={formatNumber(formData.price)}
                onChange={(e) => handleNumberChange('price', e.target.value)}
                placeholder="0"
                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="originalPrice" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-tags text-gray-400"></i>
                Harga Asli <span className="text-xs text-gray-500 font-normal">(Optional)</span>
              </label>
              <Input
                id="originalPrice"
                type="text"
                value={formatNumber(formData.originalPrice)}
                onChange={(e) => handleNumberChange('originalPrice', e.target.value)}
                placeholder="0"
                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-box text-emerald-600"></i>
                Stok
              </label>
              <Input
                id="stock"
                type="text"
                value={formatNumber(formData.stock)}
                onChange={(e) => handleNumberChange('stock', e.target.value)}
                placeholder="0"
                className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="badge" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-certificate text-gray-400"></i>
                Badge <span className="text-xs text-gray-500 font-normal">(Optional)</span>
              </label>
              <select
                id="badge"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
              >
                <option value="">Tidak ada badge</option>
                <option value="HOT">🔥 HOT</option>
                <option value="NEW">✨ NEW</option>
                <option value="SALE">💰 SALE</option>
                <option value="PROMO">🎉 PROMO</option>
                <option value="BEST">⭐ BEST</option>
                <option value="LIMITED">⏰ LIMITED</option>
                <option value="-10%">-10%</option>
                <option value="-20%">-20%</option>
                <option value="-30%">-30%</option>
                <option value="-50%">-50%</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-images text-emerald-600"></i>
              Gambar Produk (Multiple)
            </label>
            
            {/* Image Mode Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={imageMode === 'url' ? 'default' : 'outline'}
                onClick={() => setImageMode('url')}
                className={`h-10 rounded-lg ${imageMode === 'url' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-gray-300'}`}
              >
                <i className="fas fa-link mr-2"></i>URL
              </Button>
              <Button
                type="button"
                size="sm"
                variant={imageMode === 'upload' ? 'default' : 'outline'}
                onClick={() => setImageMode('upload')}
                className={`h-10 rounded-lg ${imageMode === 'upload' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border-gray-300'}`}
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
                  className="h-11 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addUrlImage()
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={addUrlImage}
                  className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload-edit"
                  disabled={isCompressing}
                />
                <label htmlFor="image-upload-edit" className={`cursor-pointer ${isCompressing ? 'opacity-50' : ''}`}>
                  <div className="text-gray-600">
                    {isCompressing ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-5xl mb-3 text-emerald-600"></i>
                        <p className="text-sm font-medium">Mengkompresi gambar...</p>
                        <p className="text-xs text-gray-500 mt-1">Mohon tunggu sebentar</p>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt text-5xl mb-3 text-emerald-600"></i>
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB (Auto-compressed)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            )}

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <p className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-upload text-blue-600"></i>
                  Uploading Images...
                </p>
                <div className="space-y-2">
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <div key={fileName} className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span className="truncate max-w-[200px]">{fileName}</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                          className="bg-blue-600 h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Image Previews */}
            {displayImages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-image text-emerald-600"></i>
                  Preview ({displayImages.length} gambar)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <AnimatePresence mode="popLayout">
                    {displayImages.map((img, index) => (
                      <motion.div 
                        key={img}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative group"
                      >
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-emerald-400 transition-colors"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                        {index === 0 && (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute bottom-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-lg"
                          >
                            <i className="fas fa-star mr-1"></i>
                            Primary
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-align-left text-emerald-600"></i>
              Deskripsi
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none placeholder:text-gray-400"
              rows={4}
              placeholder="Tulis deskripsi produk..."
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {product ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${product ? 'fa-save' : 'fa-plus-circle'} mr-2`}></i>
                    {product ? 'Update Product' : 'Buat Produk'}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
        </div>
      </motion.div>
    </motion.div>
  )
}
