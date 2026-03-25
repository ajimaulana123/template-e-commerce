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
    <div className="space-y-2 sm:space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="font-medium text-gray-900 text-sm sm:text-base">Quantity:</span>
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => onQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 sm:p-2.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 sm:px-5 py-2 font-medium text-sm sm:text-base min-w-[40px] text-center">{quantity}</span>
            <button
              onClick={() => onQuantityChange(1)}
              disabled={quantity >= stock}
              className="p-2 sm:p-2.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{stock} available</span>
        </div>
      </div>
    </div>
  )
}
