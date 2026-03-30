import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductGrid from '@/components/ProductGrid'

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 'Rp 100.000',
    images: ['/test1.jpg'],
    rating: 5,
    sold: '100',
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 'Rp 200.000',
    originalPrice: 'Rp 250.000',
    images: ['/test2.jpg'],
    rating: 4,
    badge: 'Sale',
  },
]

describe('ProductGrid', () => {
  describe('Responsive Grid Configuration', () => {
    it('should render with default responsive columns (2 mobile, 3 tablet, 4 desktop)', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toBeInTheDocument()
      expect(gridElement).toHaveClass('grid-cols-2') // mobile default
      expect(gridElement).toHaveClass('md:grid-cols-3') // tablet default
      expect(gridElement).toHaveClass('lg:grid-cols-4') // desktop default
    })

    it('should render with default gap spacing (16px mobile, 20px tablet, 24px desktop)', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('gap-4') // 16px mobile
      expect(gridElement).toHaveClass('md:gap-5') // 20px tablet
      expect(gridElement).toHaveClass('lg:gap-6') // 24px desktop
    })

    it('should support backward compatibility with number columns prop', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
          columns={6}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('grid-cols-2') // mobile always 2
      expect(gridElement).toHaveClass('md:grid-cols-3') // tablet always 3
      expect(gridElement).toHaveClass('lg:grid-cols-6') // desktop uses provided number
    })

    it('should support custom responsive columns configuration', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
          columns={{ mobile: 1, tablet: 2, desktop: 5 }}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('grid-cols-1')
      expect(gridElement).toHaveClass('md:grid-cols-2')
      expect(gridElement).toHaveClass('lg:grid-cols-5')
    })

    it('should support custom gap configuration', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
          gap={{ mobile: 12, tablet: 16, desktop: 32 }}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('gap-3') // 12px
      expect(gridElement).toHaveClass('md:gap-4') // 16px
      expect(gridElement).toHaveClass('lg:gap-8') // 32px
    })

    it('should render all products in the grid', () => {
      render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    })

    it('should render product with badge', () => {
      render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      expect(screen.getByText('Sale')).toBeInTheDocument()
    })

    it('should render product with original price when discounted', () => {
      render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      expect(screen.getByText('Rp 250.000')).toBeInTheDocument()
    })
  })

  describe('Requirements Validation', () => {
    it('validates Requirement 4.2: 2 columns on mobile (<640px)', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('grid-cols-2')
    })

    it('validates Requirement 4.3: 3 columns on tablet (640px-1024px)', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('md:grid-cols-3')
    })

    it('validates Requirement 4.4: 4-6 columns on desktop (≥1024px)', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
          columns={6}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('lg:grid-cols-6')
    })

    it('validates proper gap spacing: 16px mobile', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('gap-4') // 16px = gap-4
    })

    it('validates proper gap spacing: 20px tablet', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('md:gap-5') // 20px = gap-5
    })

    it('validates proper gap spacing: 24px desktop', () => {
      const { container } = render(
        <ProductGrid
          title="Test Products"
          products={mockProducts}
        />
      )

      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('lg:gap-6') // 24px = gap-6
    })
  })
})
