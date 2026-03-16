'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function ScrollBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show banner when at top (0-50px) or when scrolling up
      if (currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      {/* Large Desktop Banner (xl and above - 1280px+) */}
      <div className="hidden xl:block">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left side - Logo, brand, and store info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 transform rotate-45 rounded-sm"></div>
                <span className="font-bold text-gray-800 text-lg">Jabodetabek</span>
                <span className="font-bold text-blue-500 text-lg">ganti</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">
                Toko Jakarta Barat • Senin - Sabtu (09:00-20:00), Minggu/Libur Nasional (12:00-20:00), Tutup pada Hari Fitri
              </span>
              <a href="#" className="text-blue-500 hover:text-blue-600 text-sm underline">
                Selengkapnya
              </a>
            </div>

            {/* Right side - Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Service center
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                How to buy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors font-medium text-gray-800">
                Order Tracking
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop/Tablet Banner (md to lg - 768px to 1279px) */}
      <div className="hidden md:block xl:hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and brand only */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 transform rotate-45 rounded-sm"></div>
              <span className="font-bold text-gray-800 text-lg">Jabodetabek</span>
              <span className="font-bold text-blue-500 text-lg">ganti</span>
            </div>

            {/* Right side - Links only */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Service center
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                How to buy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors font-medium text-gray-800">
                Order Tracking
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Banner (below md - below 768px) */}
      <div className="block md:hidden">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left side - Logo only */}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600 transform rotate-45 rounded-sm"></div>
              <span className="font-bold text-gray-800 text-sm">Jabodetabek</span>
              <span className="font-bold text-blue-500 text-sm ml-1">ganti</span>
            </div>

            {/* Right side - Order Tracking only */}
            <div className="text-right">
              <a href="#" className="text-gray-800 hover:text-blue-600 transition-colors text-sm font-medium">
                Order Tracking
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}