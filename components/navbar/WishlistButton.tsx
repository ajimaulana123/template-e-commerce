import Link from 'next/link'
import { Heart } from 'lucide-react'

interface WishlistButtonProps {
  count?: number
  mobile?: boolean
}

export const WishlistButton = ({ count = 0, mobile = false }: WishlistButtonProps) => {
  if (mobile) {
    return (
      <Link href="/wishlist" className="relative">
        <Heart className="w-5 h-5 text-red-500" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link href="/wishlist" className="flex items-center space-x-1 lg:space-x-2 text-red-500 hover:text-red-600 relative">
      <div className="relative">
        <Heart className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
      <span className="text-sm font-medium hidden xl:inline">
        Wishlist {count > 0 && `(${count})`}
      </span>
    </Link>
  )
}