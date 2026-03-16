'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, Grid3X3, LogOut, Settings, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import CategoryModal from './CategoryModal'
import SearchDropdown from './SearchDropdown'
import { getCart } from '@/lib/cart'

export default function MainNavbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [bannerVisible, setBannerVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 50) {
        setBannerVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setBannerVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setBannerVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        const data = await response.json()
        if (data.authenticated && data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cart = await getCart()
        if (cart) {
          const count = cart.reduce((total: number, item: any) => total + item.quantity, 0)
          setCartCount(count)
        }
      } catch (error) {
        // User not logged in or error fetching cart
        setCartCount(0)
      }
    }

    fetchCartCount()

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setCartCount(0)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <nav 
        className={cn(
          'fixed left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ease-in-out',
          bannerVisible ? 'top-12 md:top-10 xl:top-12 2xl:top-14' : 'top-0'
        )}
      >
        {/* Desktop Navbar (768px+) */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="text-xl xl:text-2xl font-bold">
                    <span className="text-blue-600">jakarta</span>
                    <span className="text-orange-500">notebook</span>
                  </div>
                  <div className="text-xs text-gray-500 hidden lg:block">
                    <div>Gudang Gadget Murahnya</div>
                  </div>
                </Link>
              </div>

              {/* Center - Categories and Search */}
              <div className="flex items-center space-x-2 lg:space-x-4 flex-1 max-w-2xl relative" ref={searchRef}>
                {/* Categories Button */}
                <Button 
                  onClick={() => setCategoryModalOpen(true)}
                  variant="outline" 
                  className="flex items-center space-x-1 lg:space-x-2 bg-orange-500 text-white border-orange-500 hover:bg-orange-600 px-2 lg:px-4 text-sm"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Kategori</span>
                </Button>

                {/* Search Bar */}
                <div className="flex-1 relative min-w-0">
                  <Input
                    type="text"
                    placeholder="Toplas Kue"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchDropdownOpen(true)}
                    className="w-full pr-10 bg-gray-50 border-gray-300 text-sm"
                  />
                  <Button 
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 p-1"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                  
                  {/* Search Dropdown */}
                  <SearchDropdown 
                    isOpen={searchDropdownOpen}
                    searchQuery={searchQuery}
                    onClose={() => setSearchDropdownOpen(false)}
                    onSearchChange={(value) => {
                      setSearchQuery(value)
                      setSearchDropdownOpen(false)
                    }}
                  />
                </div>
              </div>

              {/* Right side - Cart and Profile/Login */}
              <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
                {/* Cart */}
                <Link href="/cart" className="flex items-center space-x-1 lg:space-x-2 text-orange-500 hover:text-orange-600 relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                  <span className="text-sm font-medium hidden lg:inline">My Cart</span>
                </Link>

                {/* Profile/Login */}
                {loading ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <div className="relative" ref={profileRef}>
                    <Button
                      variant="ghost"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center space-x-1 lg:space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm font-medium hidden xl:inline">
                        {user.profile?.fotoProfil ? 'Profile' : user.email?.split('@')[0] || 'Profile'}
                      </span>
                    </Button>

                    {/* Profile Dropdown */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                          </p>
                        </div>
                        
                        {user.role === 'ADMIN' && (
                          <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Settings className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        )}
                        
                        <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </Link>
                        
                        <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Package className="w-4 h-4 mr-2" />
                          My Orders
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center space-x-1 lg:space-x-2 text-blue-600 hover:text-blue-700">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium hidden xl:inline">Masuk / Daftar</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navbar (below 768px) */}
        <div className="block md:hidden">
          <div className="px-3 py-2">
            {/* Top row - Menu, Logo, Cart, User */}
            <div className="flex items-center justify-between mb-2">
              {/* Left - Menu and Logo */}
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => setCategoryModalOpen(true)}
                  variant="ghost" 
                  size="sm" 
                  className="p-1"
                >
                  <Menu className="w-5 h-5 text-orange-500" />
                </Button>
                <Link href="/" className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">JN</span>
                  </div>
                  <div className="text-sm font-bold">
                    <span className="text-blue-600">jakarta</span>
                    <span className="text-orange-500">notebook</span>
                  </div>
                </Link>
              </div>

              {/* Right - Cart and User */}
              <div className="flex items-center space-x-3">
                <Link href="/cart" className="relative">
                  <ShoppingCart className="w-5 h-5 text-orange-500" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                
                {loading ? (
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <div className="relative" ref={profileRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="p-1"
                    >
                      <User className="w-5 h-5 text-blue-600" />
                    </Button>

                    {/* Mobile Profile Dropdown */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                          </p>
                        </div>
                        
                        {user.role === 'ADMIN' && (
                          <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Settings className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                        )}
                        
                        <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </Link>
                        
                        <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Package className="w-4 h-4 mr-2" />
                          My Orders
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <User className="w-5 h-5 text-blue-600" />
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom row - Search */}
            <div className="relative" ref={searchRef}>
              <Input
                type="text"
                placeholder="Toplas Kue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchDropdownOpen(true)}
                className="w-full pr-10 bg-gray-50 border-gray-300 text-sm"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 p-1"
              >
                <Search className="w-4 h-4" />
              </Button>
              
              {/* Search Dropdown for Mobile */}
              <SearchDropdown 
                isOpen={searchDropdownOpen}
                searchQuery={searchQuery}
                onClose={() => setSearchDropdownOpen(false)}
                onSearchChange={(value) => {
                  setSearchQuery(value)
                  setSearchDropdownOpen(false)
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Category Modal */}
      <CategoryModal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
    </>
  )
}
