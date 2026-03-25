import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface WishlistButtonProps {
  count?: number
  mobile?: boolean
}

export const WishlistButton = ({ count = 0, mobile = false }: WishlistButtonProps) => {
  if (mobile) {
    return (
      <Link href="/wishlist" className="relative inline-block">
        <Heart className="w-5 h-5 text-red-500" />
        {count > 0 && (
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md border-2 border-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Button variant="ghost" size="sm" asChild className="relative hover:text-red-600">
      <Link href="/wishlist" className="flex items-center space-x-1 lg:space-x-2 text-red-500">
        <div className="relative">
          <Heart className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-4 -right-4 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 shadow-md border-2 border-white">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
        <span className="text-sm font-medium hidden xl:inline">
          Wishlist {count > 0 && `(${count})`}
        </span>
      </Link>
    </Button>
  )
}