import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Share2, MessageCircle } from 'lucide-react'
import { generateProductWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

interface ProductActionsProps {
  product: Product
  quantity: number
  addingToCart: boolean
  inWishlist: boolean
  wishlistLoading: boolean
  onAddToCart: () => void
  onBuyNow: () => void
  onToggleWishlist: () => void
  onShare: () => void
}

export function ProductActions({
  product,
  quantity,
  addingToCart,
  inWishlist,
  wishlistLoading,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onShare
}: ProductActionsProps) {
  const handleOrderWhatsApp = () => {
    const message = generateProductWhatsAppMessage(product, quantity)
    openWhatsApp(message)
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50 text-sm sm:text-base h-11 sm:h-auto"
          onClick={onAddToCart}
          disabled={addingToCart || product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base h-11 sm:h-auto"
          onClick={onBuyNow}
          disabled={addingToCart || product.stock === 0}
        >
          {addingToCart ? 'Processing...' : 'Buy Now'}
        </Button>
      </div>

      {/* WhatsApp Order Button */}
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base h-11 sm:h-auto"
        onClick={handleOrderWhatsApp}
        disabled={product.stock === 0}
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Order via WhatsApp
      </Button>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4">
        <Button 
          variant="outline" 
          className={`flex-1 text-xs sm:text-sm h-10 sm:h-auto ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300'}`}
          onClick={onToggleWishlist}
          disabled={wishlistLoading}
        >
          <Heart className={`w-4 h-4 sm:mr-2 ${inWishlist ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">
            {wishlistLoading ? 'Loading...' : inWishlist ? 'In Wishlist' : 'Wishlist'}
          </span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-xs sm:text-sm h-10 sm:h-auto" 
          onClick={onShare}
        >
          <Share2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </div>
  )
}
