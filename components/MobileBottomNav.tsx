'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, ShoppingCart, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartCount, useWishlistCount } from './navbar/hooks'
import { tokens } from '@/lib/design-tokens'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  ariaLabel: string
  showBadge?: boolean
  badgeCount?: number
}

interface MobileBottomNavProps {
  className?: string
}

export function MobileBottomNav({ className }: MobileBottomNavProps) {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      ariaLabel: 'Navigate to home page',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Grid3X3,
      href: '/products',
      ariaLabel: 'Browse product categories',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      href: '/cart',
      ariaLabel: `Shopping cart with ${cartCount} items`,
      showBadge: true,
      badgeCount: cartCount,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      href: '/wishlist',
      ariaLabel: `Wishlist with ${wishlistCount} items`,
      showBadge: true,
      badgeCount: wishlistCount,
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      href: '/profile',
      ariaLabel: 'View your account',
    },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-white border-t border-neutral-200',
        'shadow-lg',
        'md:hidden', // Hide on desktop (≥768px)
        className
      )}
      style={{ height: tokens.space[16] }} // 64px
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'min-w-[48px] min-h-[48px]', // 48x48px touch target
                'px-3 py-2',
                'rounded-lg',
                'transition-all duration-200',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
                active
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
              )}
              aria-label={item.ariaLabel}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6',
                    'transition-transform duration-200',
                    active && 'scale-110'
                  )}
                />
                {item.showBadge && item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={cn(
                      'absolute -top-2 -right-2',
                      'flex items-center justify-center',
                      'min-w-[18px] h-[18px]',
                      'px-1',
                      'bg-red-500 text-white',
                      'text-xs font-semibold',
                      'rounded-full',
                      'border-2 border-white'
                    )}
                    aria-label={`${item.badgeCount} items`}
                  >
                    {item.badgeCount > 99 ? '99+' : item.badgeCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium mt-1',
                  'transition-colors duration-200',
                  active ? 'text-primary-600' : 'text-neutral-600'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
