import { Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from './Logo'
import { SearchBar } from './SearchBar'
import { CartButton } from './CartButton'
import { WishlistButton } from './WishlistButton'
import { UserMenu } from './UserMenu'
import type { User } from './types'

interface DesktopNavbarProps {
  user: User | null
  loading: boolean
  cartCount: number
  wishlistCount: number
  onLogout: () => void
  onCategoryClick: () => void
}

export const DesktopNavbar = ({
  user,
  loading,
  cartCount,
  wishlistCount,
  onLogout,
  onCategoryClick
}: DesktopNavbarProps) => {
  return (
    <div className="hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Logo />
          </div>

          {/* Center - Categories and Search */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-1 max-w-2xl">
            <Button 
              onClick={onCategoryClick}
              variant="outline" 
              className="flex items-center space-x-1 lg:space-x-2 bg-orange-500 text-white border-orange-500 hover:bg-orange-600 px-2 lg:px-4 text-sm"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Kategori</span>
            </Button>

            <SearchBar className="flex-1 min-w-0" />
          </div>

          {/* Right side - Wishlist, Cart and Profile */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <WishlistButton count={wishlistCount} />
            <CartButton count={cartCount} />
            <UserMenu user={user} loading={loading} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </div>
  )
}
