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
      <Link href="/cart" className="relative inline-block">
        <ShoppingCart className="w-5 h-5 text-green-600" />
        {count > 0 && (
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md border-2 border-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Button variant="ghost" size="sm" asChild className="relative hover:text-green-600">
      <Link href="/cart" className="flex items-center space-x-1 lg:space-x-2 text-green-600">
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-4 -right-4 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1.5 shadow-md border-2 border-white">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
        <span className="text-sm font-medium hidden lg:inline">My Cart</span>
      </Link>
    </Button>
  )
}
