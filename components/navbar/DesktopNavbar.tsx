'use client'

import { Grid3X3, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from './Logo'
import { SearchBar } from './SearchBar'
import { CartButton } from './CartButton'
import { WishlistButton } from './WishlistButton'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils'
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
    <div className="hidden md:block w-full bg-white/80 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center shrink-0 transition-transform hover:scale-[1.02] active:scale-100">
            <Logo />
          </div>

          {/* CENTER: Categories & Search Bar */}
          <div className="flex items-center flex-1 max-w-3xl gap-4">
            {/* Category Button - Styled to look more premium */}
            <Button 
              onClick={onCategoryClick}
              variant="ghost"
              className={cn(
                "group flex items-center gap-2 px-4 py-6 font-semibold transition-all",
                "bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 border border-gray-100 hover:border-green-200 shadow-sm"
              )}
            >
              <Grid3X3 className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              <span className="hidden lg:inline tracking-tight">Kategori</span>
            </Button>

            {/* SearchBar - Wrapped for better spacing control */}
            <div className="flex-1 group">
              <SearchBar className="w-full transition-all group-focus-within:ring-2 group-focus-within:ring-green-500/10 rounded-xl" />
            </div>
          </div>

          {/* RIGHT: Actions (Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-2 lg:gap-5 shrink-0">
            
            {/* Action Group dengan Separator Halus */}
            <div className="flex items-center gap-1 lg:gap-3 pr-2 border-r border-gray-100">
              <div className="transition-transform hover:-translate-y-0.5">
                <WishlistButton count={wishlistCount} />
              </div>
              <div className="transition-transform hover:-translate-y-0.5">
                <CartButton count={cartCount} />
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center pl-1">
              <UserMenu user={user} loading={loading} onLogout={onLogout} />
            </div>
            
          </div>

        </div>
      </div>
    </div>
  )
}