import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileLogo } from './Logo'
import { SearchBar } from './SearchBar'
import { CartButton } from './CartButton'
import { WishlistButton } from './WishlistButton'
import { UserMenu } from './UserMenu'
import type { User } from './types'

interface MobileNavbarProps {
  user: User | null
  loading: boolean
  cartCount: number
  wishlistCount: number
  onLogout: () => void
  onCategoryClick: () => void
}

export const MobileNavbar = ({
  user,
  loading,
  cartCount,
  wishlistCount,
  onLogout,
  onCategoryClick
}: MobileNavbarProps) => {
  return (
    <div className="block md:hidden">
      <div className="px-3 py-2">
        {/* Top row - Menu, Logo, Cart, User */}
        <div className="flex items-center justify-between mb-2">
          {/* Left - Menu and Logo */}
          <div className="flex items-center space-x-2">
            <Button 
              onClick={onCategoryClick}
              variant="ghost" 
              size="sm" 
              className="p-1"
            >
              <Menu className="w-5 h-5 text-orange-500" />
            </Button>
            <MobileLogo />
          </div>

          {/* Right - Wishlist, Cart and User */}
          <div className="flex items-center space-x-3">
            <WishlistButton count={wishlistCount} mobile />
            <CartButton count={cartCount} mobile />
            <UserMenu user={user} loading={loading} onLogout={onLogout} mobile />
          </div>
        </div>

        {/* Bottom row - Search */}
        <SearchBar />
      </div>
    </div>
  )
}
