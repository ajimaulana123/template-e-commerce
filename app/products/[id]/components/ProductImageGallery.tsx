import { useState } from 'react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  badge?: string | null
  discount?: number | null
}

export function ProductImageGallery({ 
  images, 
  productName, 
  badge, 
  discount 
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white rounded-lg overflow-hidden border">
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-96 object-cover"
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {badge}
          </div>
        )}
        {discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
              selectedImage === index ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
