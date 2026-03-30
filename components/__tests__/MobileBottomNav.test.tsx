import React from 'react'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { MobileBottomNav } from '../MobileBottomNav'
import { useCartCount, useWishlistCount } from '../navbar/hooks'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock navbar hooks
jest.mock('../navbar/hooks', () => ({
  useCartCount: jest.fn(),
  useWishlistCount: jest.fn(),
}))

describe('MobileBottomNav Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useCartCount as jest.Mock).mockReturnValue(0)
    ;(useWishlistCount as jest.Mock).mockReturnValue(0)
  })

  describe('Rendering', () => {
    it('should render all 5 navigation items', () => {
      render(<MobileBottomNav />)
      
      expect(screen.getByLabelText('Navigate to home page')).toBeInTheDocument()
      expect(screen.getByLabelText('Browse product categories')).toBeInTheDocument()
      expect(screen.getByLabelText(/Shopping cart with/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Wishlist with/)).toBeInTheDocument()
      expect(screen.getByLabelText('View your account')).toBeInTheDocument()
    })

    it('should render with correct labels', () => {
      render(<MobileBottomNav />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('Cart')).toBeInTheDocument()
      expect(screen.getByText('Wishlist')).toBeInTheDocument()
      expect(screen.getByText('Account')).toBeInTheDocument()
    })

    it('should have fixed bottom positioning', () => {
      const { container } = render(<MobileBottomNav />)
      
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('fixed')
      expect(nav?.className).toContain('bottom-0')
    })

    it('should have 64px height', () => {
      const { container } = render(<MobileBottomNav />)
      
      const nav = container.querySelector('nav')
      expect(nav?.style.height).toBe('4rem') // 64px = 4rem
    })

    it('should be hidden on desktop (md:hidden)', () => {
      const { container } = render(<MobileBottomNav />)
      
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('md:hidden')
    })
  })

  describe('Touch Targets', () => {
    it('should have minimum 48x48px touch targets', () => {
      const { container } = render(<MobileBottomNav />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link.className).toContain('min-w-[48px]')
        expect(link.className).toContain('min-h-[48px]')
      })
    })

    it('should have proper spacing between items', () => {
      const { container } = render(<MobileBottomNav />)
      
      const itemsContainer = container.querySelector('.flex.items-center.justify-around')
      expect(itemsContainer).toBeInTheDocument()
      expect(itemsContainer?.className).toContain('px-2')
    })
  })

  describe('Active State', () => {
    it('should mark home as active when on home page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')
      render(<MobileBottomNav />)
      
      const homeLink = screen.getByLabelText('Navigate to home page')
      expect(homeLink.getAttribute('aria-current')).toBe('page')
      expect(homeLink.className).toContain('text-primary-600')
      expect(homeLink.className).toContain('bg-primary-50')
    })

    it('should mark categories as active when on products page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/products')
      render(<MobileBottomNav />)
      
      const categoriesLink = screen.getByLabelText('Browse product categories')
      expect(categoriesLink.getAttribute('aria-current')).toBe('page')
    })

    it('should mark cart as active when on cart page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/cart')
      render(<MobileBottomNav />)
      
      const cartLink = screen.getByLabelText(/Shopping cart with/)
      expect(cartLink.getAttribute('aria-current')).toBe('page')
    })

    it('should mark wishlist as active when on wishlist page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/wishlist')
      render(<MobileBottomNav />)
      
      const wishlistLink = screen.getByLabelText(/Wishlist with/)
      expect(wishlistLink.getAttribute('aria-current')).toBe('page')
    })

    it('should mark account as active when on profile page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/profile')
      render(<MobileBottomNav />)
      
      const accountLink = screen.getByLabelText('View your account')
      expect(accountLink.getAttribute('aria-current')).toBe('page')
    })
  })

  describe('Badge Support', () => {
    it('should display cart badge when cart has items', () => {
      ;(useCartCount as jest.Mock).mockReturnValue(3)
      render(<MobileBottomNav />)
      
      expect(screen.getByLabelText('3 items')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should display wishlist badge when wishlist has items', () => {
      ;(useWishlistCount as jest.Mock).mockReturnValue(5)
      render(<MobileBottomNav />)
      
      expect(screen.getByLabelText('5 items')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should not display badge when count is 0', () => {
      ;(useCartCount as jest.Mock).mockReturnValue(0)
      ;(useWishlistCount as jest.Mock).mockReturnValue(0)
      const { container } = render(<MobileBottomNav />)
      
      const badges = container.querySelectorAll('.bg-red-500')
      expect(badges.length).toBe(0)
    })

    it('should display "99+" for counts over 99', () => {
      ;(useCartCount as jest.Mock).mockReturnValue(150)
      render(<MobileBottomNav />)
      
      expect(screen.getByText('99+')).toBeInTheDocument()
    })

    it('should update aria-label with cart count', () => {
      ;(useCartCount as jest.Mock).mockReturnValue(7)
      render(<MobileBottomNav />)
      
      expect(screen.getByLabelText('Shopping cart with 7 items')).toBeInTheDocument()
    })

    it('should update aria-label with wishlist count', () => {
      ;(useWishlistCount as jest.Mock).mockReturnValue(12)
      render(<MobileBottomNav />)
      
      expect(screen.getByLabelText('Wishlist with 12 items')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper navigation aria-label', () => {
      const { container } = render(<MobileBottomNav />)
      
      const nav = container.querySelector('nav')
      expect(nav?.getAttribute('aria-label')).toBe('Mobile bottom navigation')
    })

    it('should have descriptive aria-labels for all links', () => {
      render(<MobileBottomNav />)
      
      expect(screen.getByLabelText('Navigate to home page')).toBeInTheDocument()
      expect(screen.getByLabelText('Browse product categories')).toBeInTheDocument()
      expect(screen.getByLabelText(/Shopping cart with/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Wishlist with/)).toBeInTheDocument()
      expect(screen.getByLabelText('View your account')).toBeInTheDocument()
    })

    it('should have focus-visible styles', () => {
      const { container } = render(<MobileBottomNav />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link.className).toContain('focus-visible:outline')
      })
    })

    it('should have proper link hrefs', () => {
      render(<MobileBottomNav />)
      
      expect(screen.getByLabelText('Navigate to home page')).toHaveAttribute('href', '/')
      expect(screen.getByLabelText('Browse product categories')).toHaveAttribute('href', '/products')
      expect(screen.getByLabelText(/Shopping cart with/)).toHaveAttribute('href', '/cart')
      expect(screen.getByLabelText(/Wishlist with/)).toHaveAttribute('href', '/wishlist')
      expect(screen.getByLabelText('View your account')).toHaveAttribute('href', '/profile')
    })
  })

  describe('Visual Feedback', () => {
    it('should have transition classes for smooth animations', () => {
      const { container } = render(<MobileBottomNav />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link.className).toContain('transition-all')
        expect(link.className).toContain('duration-200')
      })
    })

    it('should scale active icons', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')
      const { container } = render(<MobileBottomNav />)
      
      const homeLink = screen.getByLabelText('Navigate to home page')
      const icon = homeLink.querySelector('svg')
      // SVG className is an SVGAnimatedString, so we need to get the baseVal
      const className = icon?.getAttribute('class') || ''
      expect(className).toContain('scale-110')
    })

    it('should have hover styles for inactive items', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')
      const { container } = render(<MobileBottomNav />)
      
      const links = container.querySelectorAll('a')
      // Check non-home links have hover styles
      const categoriesLink = screen.getByLabelText('Browse product categories')
      expect(categoriesLink.className).toContain('hover:text-primary-600')
      expect(categoriesLink.className).toContain('hover:bg-neutral-50')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className prop', () => {
      const { container } = render(<MobileBottomNav className="custom-class" />)
      
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('custom-class')
    })
  })

  describe('Responsive Visibility', () => {
    it('should be visible on mobile only', () => {
      const { container } = render(<MobileBottomNav />)
      
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('md:hidden')
    })

    it('should have z-index of 40', () => {
      const { container } = render(<MobileBottomNav />)
      
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('z-40')
    })
  })
})
