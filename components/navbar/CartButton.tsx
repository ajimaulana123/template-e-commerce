import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CartButtonProps {
  count: number
  mobile?: boolean
}

export const CartButton = ({ count, mobile = false }: CartButtonProps) => {
  if (mobile) {
    return (
      <Link href="/cart" className="relative">
        <ShoppingCart className="w-5 h-5 text-green-600" />
        {count > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs"
          >
            {count > 9 ? '9+' : count}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <Button variant="ghost" size="sm" asChild className="relative hover:text-green-600">
      <Link href="/cart" className="flex items-center space-x-1 lg:space-x-2 text-green-600">
        <ShoppingCart className="w-5 h-5" />
        {count > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {count > 99 ? '99+' : count}
          </Badge>
        )}
        <span className="text-sm font-medium hidden lg:inline">My Cart</span>
      </Link>
    </Button>
  )
}
