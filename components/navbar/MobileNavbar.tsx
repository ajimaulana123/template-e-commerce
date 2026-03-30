'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileLogo } from './Logo'
import { SearchBar } from './SearchBar'
import { CartButton } from './CartButton'
import { WishlistButton } from './WishlistButton'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils'
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
    <div className="block md:hidden w-full bg-white/95 backdrop-blur-sm">
      <div className="px-4 py-3">
        {/* Top row - Navigation & Branding */}
        <div className="flex items-center justify-between mb-3">
          
          {/* Left - Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={onCategoryClick}
              variant="ghost" 
              size="icon" 
              className="w-10 h-10 rounded-xl bg-gray-50 text-green-600 hover:bg-green-50 active:scale-90 transition-all"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="scale-95 origin-left">
              <MobileLogo />
            </div>
          </div>

          {/* Right - Interaction Icons */}
         <div className="flex items-center gap-3 md:gap-4"> 
            <div className="transition-transform active:scale-90">
              <WishlistButton count={wishlistCount} mobile />
            </div>
            <div className="transition-transform active:scale-90">
              <CartButton count={cartCount} mobile />
            </div>
            
            {/* UserMenu dikasih margin kiri dikit biar pemisahnya jelas */}
            <div className="ml-1 pl-2 border-l border-gray-100 h-6 flex items-center">
              <UserMenu user={user} loading={loading} onLogout={onLogout} mobile />
            </div>
          </div>
        </div>

        {/* Bottom row - Search Bar Area */}
        <div className="relative group">
          <SearchBar className="w-full" />
          {/* Efek hiasan halus di bawah search bar mobile */}
          <div className="absolute -bottom-1 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />
        </div>
      </div>
    </div>
  )
}