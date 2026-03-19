import { Plus, Minus } from 'lucide-react'

interface ProductQuantitySelectorProps {
  quantity: number
  stock: number
  onQuantityChange: (change: number) => void
}

export function ProductQuantitySelector({ 
  quantity, 
  stock, 
  onQuantityChange 
}: ProductQuantitySelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <span className="font-medium text-gray-900">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <button
            onClick={() => onQuantityChange(1)}
            disabled={quantity >= stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-600">{stock} pieces available</span>
      </div>
    </div>
  )
}
