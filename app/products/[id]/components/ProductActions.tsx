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
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={onAddToCart}
          disabled={addingToCart || product.stock === 0}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={onBuyNow}
          disabled={addingToCart || product.stock === 0}
        >
          {addingToCart ? 'Processing...' : 'Buy Now'}
        </Button>
      </div>

      {/* WhatsApp Order Button */}
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handleOrderWhatsApp}
        disabled={product.stock === 0}
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Order via WhatsApp
      </Button>

      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex-1 ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300'}`}
          onClick={onToggleWishlist}
          disabled={wishlistLoading}
        >
          <Heart className={`w-4 h-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
          {wishlistLoading ? 'Loading...' : inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}
