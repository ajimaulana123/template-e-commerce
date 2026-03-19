'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CategoryModal from './CategoryModal'
import { DesktopNavbar } from './navbar/DesktopNavbar'
import { MobileNavbar } from './navbar/MobileNavbar'
import { useAuth, useCartCount, useWishlistCount, useScrollBanner } from './navbar/hooks'

export default function MainNavbar() {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  
  // Custom hooks for separation of concerns
  const bannerVisible = useScrollBanner()
  const { user, loading, logout } = useAuth()
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()

  const handleCategoryClick = () => setCategoryModalOpen(true)
  const handleCategoryClose = () => setCategoryModalOpen(false)

  return (
    <>
      <nav 
        className={cn(
          'fixed left-0 right-0 z-40 bg-white transition-all duration-300 ease-in-out',
          // Single border at bottom
          'border-b-2 border-b-gray-300',
          'shadow-md',
          bannerVisible ? 'top-12 md:top-10 xl:top-12 2xl:top-14' : 'top-0'
        )}
      >
        <DesktopNavbar
          user={user}
          loading={loading}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onLogout={logout}
          onCategoryClick={handleCategoryClick}
        />

        <MobileNavbar
          user={user}
          loading={loading}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onLogout={logout}
          onCategoryClick={handleCategoryClick}
        />
      </nav>

      <CategoryModal isOpen={categoryModalOpen} onClose={handleCategoryClose} />
    </>
  )
}
