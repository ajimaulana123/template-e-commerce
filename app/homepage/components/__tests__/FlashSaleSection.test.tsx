import React from 'react'
import { render, screen } from '@testing-library/react'
import FlashSaleSection from '../FlashSaleSection'

// Mock timers for countdown tests
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

describe('FlashSaleSection', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 'Rp 100.000',
      originalPrice: 'Rp 150.000',
      images: ['/test1.jpg'],
      rating: 4,
      sold: '100',
      badge: '30% OFF'
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 'Rp 200.000',
      originalPrice: 'Rp 250.000',
      images: ['/test2.jpg'],
      rating: 5,
      sold: '200',
      badge: '20% OFF'
    }
  ]

  it('should render flash sale section with products', () => {
    render(<FlashSaleSection products={mockProducts} />)
    
    // Check heading is present
    expect(screen.getByText('Flash Sale Hari Ini')).toBeInTheDocument()
    
    // Check products are rendered
    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2')).toBeInTheDocument()
  })

  it('should render with distinctive styling (gradient border)', () => {
    const { container } = render(<FlashSaleSection products={mockProducts} />)
    
    // Check for section with aria-label
    const section = screen.getByLabelText('Flash sale section')
    expect(section).toBeInTheDocument()
    
    // Check for gradient background classes
    expect(section).toHaveClass('before:bg-gradient-to-r')
  })

  it('should render prominent heading with icon', () => {
    render(<FlashSaleSection products={mockProducts} />)
    
    // Check heading exists
    const heading = screen.getByRole('heading', { name: /flash sale hari ini/i })
    expect(heading).toBeInTheDocument()
    
    // Check icon container exists (has aria-hidden for accessibility)
    const iconContainer = heading.parentElement?.querySelector('[aria-hidden="true"]')
    expect(iconContainer).toBeInTheDocument()
  })

  it('should limit products to maxProducts', () => {
    const manyProducts = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      name: `Product ${i}`,
      price: 'Rp 100.000',
      images: ['/test.jpg']
    }))

    render(<FlashSaleSection products={manyProducts} maxProducts={3} />)
    
    // Should only render 3 products
    expect(screen.getByText('Product 0')).toBeInTheDocument()
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
    expect(screen.queryByText('Product 3')).not.toBeInTheDocument()
  })

  it('should not render when no products', () => {
    const { container } = render(<FlashSaleSection products={[]} />)
    
    // Should return null and not render anything
    expect(container.firstChild).toBeNull()
  })

  it('should render "View all" link with proper href', () => {
    render(<FlashSaleSection products={mockProducts} />)
    
    const viewAllLink = screen.getByRole('link', { name: /view all flash sale products/i })
    expect(viewAllLink).toBeInTheDocument()
    expect(viewAllLink).toHaveAttribute('href', '/products?filter=flash-sale')
  })

  it('should render product badges', () => {
    render(<FlashSaleSection products={mockProducts} />)
    
    expect(screen.getByText('30% OFF')).toBeInTheDocument()
    expect(screen.getByText('20% OFF')).toBeInTheDocument()
  })

  it('should render product ratings', () => {
    render(<FlashSaleSection products={mockProducts} />)
    
    // Check for star icons (using FontAwesome classes)
    const stars = document.querySelectorAll('.fa-star')
    expect(stars.length).toBeGreaterThan(0)
  })

  it('should render original and sale prices', () => {
    render(<FlashSaleSection products={mockProducts} />)
    
    // Sale prices (in red)
    expect(screen.getByText('Rp 100.000')).toBeInTheDocument()
    expect(screen.getByText('Rp 200.000')).toBeInTheDocument()
    
    // Original prices (strikethrough)
    expect(screen.getByText('Rp 150.000')).toBeInTheDocument()
    expect(screen.getByText('Rp 250.000')).toBeInTheDocument()
  })

  it('should apply hover effects to product cards', () => {
    const { container } = render(<FlashSaleSection products={mockProducts} />)
    
    // Check for hover transition classes
    const productCards = container.querySelectorAll('.hover\\:shadow-lg')
    expect(productCards.length).toBe(mockProducts.length)
  })

  it('should integrate with product grid layout', () => {
    const { container } = render(<FlashSaleSection products={mockProducts} />)
    
    // Check for responsive grid classes
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid-cols-2') // mobile
    expect(grid).toHaveClass('md:grid-cols-3') // tablet
    expect(grid).toHaveClass('lg:grid-cols-6') // desktop
  })

  describe('Countdown Timer Integration', () => {
    it('should render countdown timer when endTime is provided', () => {
      const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      render(<FlashSaleSection products={mockProducts} endTime={futureTime} />)
      
      // Check for timer role
      const timer = screen.getByRole('timer')
      expect(timer).toBeInTheDocument()
      
      // Check for time unit labels
      expect(screen.getByText('Jam')).toBeInTheDocument()
      expect(screen.getByText('Menit')).toBeInTheDocument()
      expect(screen.getByText('Detik')).toBeInTheDocument()
    })

    it('should not render countdown timer when endTime is not provided', () => {
      render(<FlashSaleSection products={mockProducts} />)
      
      // Timer should not be present
      expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    })

    it('should display countdown timer above product grid', () => {
      const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000)
      const { container } = render(<FlashSaleSection products={mockProducts} endTime={futureTime} />)
      
      const timer = screen.getByRole('timer')
      const grid = container.querySelector('.grid')
      
      // Timer should come before grid in DOM
      expect(timer.compareDocumentPosition(grid!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    })
  })
})
