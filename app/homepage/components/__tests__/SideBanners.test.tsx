import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import SideBanners from '../SideBanners'
import type { FeaturedProductsResponse } from '@/components/hero-slider/types'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockPush = jest.fn()

const mockFeaturedProducts: FeaturedProductsResponse = {
  flashSale: {
    id: 'flash-1',
    name: 'Premium Dates',
    price: 50000,
    image: '/images/dates.jpg',
    category: 'Snacks',
    originalPrice: 100000,
    discount: 50,
  },
  bestSeller: {
    id: 'best-1',
    name: 'Halal Chicken',
    price: 75000,
    image: '/images/chicken.jpg',
    category: 'Meat',
    sold: 1500,
  },
  newArrival: {
    id: 'new-1',
    name: 'Organic Honey',
    price: 120000,
    image: '/images/honey.jpg',
    category: 'Pantry',
    createdAt: '2024-01-01',
  },
}

describe('SideBanners Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  describe('Loading State', () => {
    it('should render skeleton loaders when loading is true', () => {
      const { container } = render(<SideBanners featuredProducts={null} loading={true} />)
      
      // Check for skeleton elements
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('should be hidden on mobile and tablet (lg:flex)', () => {
      const { container } = render(<SideBanners featuredProducts={null} loading={true} />)
      
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('hidden')
      expect(wrapper.className).toContain('lg:flex')
    })
  })

  describe('Loaded State', () => {
    it('should render all three banners when featured products are provided', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      // Check for Flash Sale banner
      expect(screen.getByText('FLASH SALE')).toBeInTheDocument()
      expect(screen.getByText('Premium Dates')).toBeInTheDocument()
      expect(screen.getByText('-50%')).toBeInTheDocument()
      
      // Check for Best Seller banner
      expect(screen.getByText('TERLARIS')).toBeInTheDocument()
      expect(screen.getByText('Halal Chicken')).toBeInTheDocument()
      expect(screen.getByText('1500+ Terjual')).toBeInTheDocument()
      
      // Check for New Arrival banner
      expect(screen.getByText('PRODUK BARU')).toBeInTheDocument()
      expect(screen.getByText('Organic Honey')).toBeInTheDocument()
    })

    it('should display fallback when flash sale is null', () => {
      const productsWithoutFlashSale: FeaturedProductsResponse = {
        ...mockFeaturedProducts,
        flashSale: null,
      }
      
      render(<SideBanners featuredProducts={productsWithoutFlashSale} loading={false} />)
      
      expect(screen.getByText('No Flash Sale')).toBeInTheDocument()
    })

    it('should display fallback when best seller is null', () => {
      const productsWithoutBestSeller: FeaturedProductsResponse = {
        ...mockFeaturedProducts,
        bestSeller: null,
      }
      
      render(<SideBanners featuredProducts={productsWithoutBestSeller} loading={false} />)
      
      expect(screen.getByText('No Best Seller')).toBeInTheDocument()
    })

    it('should display fallback when new arrival is null', () => {
      const productsWithoutNewArrival: FeaturedProductsResponse = {
        ...mockFeaturedProducts,
        newArrival: null,
      }
      
      render(<SideBanners featuredProducts={productsWithoutNewArrival} loading={false} />)
      
      expect(screen.getByText('No New Arrival')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should have 40% width on desktop', () => {
      const { container } = render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('w-[40%]')
    })

    it('should be hidden on mobile and tablet viewports', () => {
      const { container } = render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('hidden')
      expect(wrapper.className).toContain('lg:flex')
    })
  })

  describe('Interactions', () => {
    it('should navigate to product page when flash sale banner is clicked', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const flashSaleBanner = screen.getByLabelText(/Flash sale: Premium Dates/i)
      fireEvent.click(flashSaleBanner)
      
      expect(mockPush).toHaveBeenCalledWith('/products/flash-1')
    })

    it('should navigate to product page when best seller banner is clicked', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const bestSellerBanner = screen.getByLabelText(/Best seller: Halal Chicken/i)
      fireEvent.click(bestSellerBanner)
      
      expect(mockPush).toHaveBeenCalledWith('/products/best-1')
    })

    it('should navigate to product page when new arrival banner is clicked', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const newArrivalBanner = screen.getByLabelText(/New arrival: Organic Honey/i)
      fireEvent.click(newArrivalBanner)
      
      expect(mockPush).toHaveBeenCalledWith('/products/new-1')
    })

    it('should navigate when Enter key is pressed on flash sale banner', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const flashSaleBanner = screen.getByLabelText(/Flash sale: Premium Dates/i)
      fireEvent.keyDown(flashSaleBanner, { key: 'Enter' })
      
      expect(mockPush).toHaveBeenCalledWith('/products/flash-1')
    })

    it('should navigate when Space key is pressed on best seller banner', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const bestSellerBanner = screen.getByLabelText(/Best seller: Halal Chicken/i)
      fireEvent.keyDown(bestSellerBanner, { key: ' ' })
      
      expect(mockPush).toHaveBeenCalledWith('/products/best-1')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all banners', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      expect(screen.getByLabelText(/Flash sale: Premium Dates, 50% off/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Best seller: Halal Chicken, 1500 plus sold/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/New arrival: Organic Honey/i)).toBeInTheDocument()
    })

    it('should have role="button" for interactive banners', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(3) // Flash sale, best seller, new arrival
    })

    it('should have tabIndex={0} for keyboard navigation', () => {
      const { container } = render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const interactiveBanners = container.querySelectorAll('[tabindex="0"]')
      expect(interactiveBanners.length).toBe(3)
    })

    it('should have role="presentation" for decorative images', () => {
      const { container } = render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const decorativeImages = container.querySelectorAll('img[role="presentation"]')
      expect(decorativeImages.length).toBe(3)
    })

    it('should have complementary role for the container', () => {
      render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      expect(screen.getByRole('complementary', { name: 'Featured products' })).toBeInTheDocument()
    })
  })

  describe('Hover Effects', () => {
    it('should have hover scale transition classes', () => {
      const { container } = render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const banners = container.querySelectorAll('.hover\\:scale-105')
      expect(banners.length).toBe(3)
    })

    it('should have transition duration classes', () => {
      const { container } = render(<SideBanners featuredProducts={mockFeaturedProducts} loading={false} />)
      
      const banners = container.querySelectorAll('.transition-transform')
      expect(banners.length).toBe(3)
    })
  })

  describe('Custom className', () => {
    it('should apply custom className prop', () => {
      const { container } = render(
        <SideBanners 
          featuredProducts={mockFeaturedProducts} 
          loading={false} 
          className="custom-class"
        />
      )
      
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('custom-class')
    })
  })
})
