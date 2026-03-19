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
      <Link href="/wishlist" className="relative">
        <Heart className="w-5 h-5 text-red-500" />
        {count > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {count > 99 ? '99+' : count}
          </Badge>
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
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </div>
        <span className="text-sm font-medium hidden xl:inline">
          Wishlist {count > 0 && `(${count})`}
        </span>
      </Link>
    </Button>
  )
}