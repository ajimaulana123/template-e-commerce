import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface CartButtonProps {
  count: number
  mobile?: boolean
}

export const CartButton = ({ count, mobile = false }: CartButtonProps) => {
  if (mobile) {
    return (
      <Link href="/cart" className="relative">
        <ShoppingCart className="w-5 h-5 text-orange-500" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link href="/cart" className="flex items-center space-x-1 lg:space-x-2 text-orange-500 hover:text-orange-600 relative">
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {count > 99 ? '99+' : count}
        </span>
      )}
      <span className="text-sm font-medium hidden lg:inline">My Cart</span>
    </Link>
  )
}
