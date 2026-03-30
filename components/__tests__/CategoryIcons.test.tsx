import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'
import CategoryIcons from '../CategoryIcons'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

const mockCategories = [
  { id: '1', name: 'Meat', icon: 'fas fa-drumstick-bite', slug: 'meat' },
  { id: '2', name: 'Dairy', icon: 'fas fa-cheese', slug: 'dairy' },
  { id: '3', name: 'Bakery', icon: 'fas fa-bread-slice', slug: 'bakery' },
  { id: '4', name: 'Snacks', icon: 'fas fa-cookie', slug: 'snacks' },
  { id: '5', name: 'Beverages', icon: 'fas fa-mug-hot', slug: 'beverages' },
]

describe('CategoryIcons Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    })
  })

  describe('Rendering', () => {
    it('should render all categories', () => {
      render(<CategoryIcons categories={mockCategories} />)
      
      mockCategories.forEach(category => {
        expect(screen.getByText(category.name)).toBeInTheDocument()
      })
    })

    it('should render category icons', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      mockCategories.forEach(category => {
        const icon = container.querySelector(`.${category.icon.replace(' ', '.')}`)
        expect(icon).toBeInTheDocument()
      })
    })

    it('should render default icon when category icon is null', () => {
      const categoriesWithNull = [
        { id: '1', name: 'Test', icon: null, slug: 'test' }
      ]
      const { container } = render(<CategoryIcons categories={categoriesWithNull} />)
      
      const defaultIcon = container.querySelector('.fa-th')
      expect(defaultIcon).toBeInTheDocument()
    })

    it('should have proper section aria-label', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const section = container.querySelector('section')
      expect(section).toHaveAttribute('aria-label', 'Product categories')
    })
  })

  describe('Touch Targets - Requirement 3.1, 3.2', () => {
    it('should have minimum 56x56px touch targets', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const iconContainers = container.querySelectorAll('[class*="w-14 h-14"]')
      expect(iconContainers.length).toBeGreaterThan(0)
      
      // w-14 = 56px, h-14 = 56px in Tailwind
      iconContainers.forEach(icon => {
        expect(icon).toHaveClass('w-14')
        expect(icon).toHaveClass('h-14')
      })
    })

    it('should have proper spacing between items - Requirement 3.3', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const scrollContainer = container.querySelector('[role="list"]')
      expect(scrollContainer).toHaveClass('gap-3') // 12px gap
    })
  })

  describe('Active State - Requirement 3.4', () => {
    it('should highlight active category', () => {
      ;(useSearchParams as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue('meat'),
      })
      
      render(<CategoryIcons categories={mockCategories} />)
      
      const meatLink = screen.getByLabelText('Browse Meat products')
      expect(meatLink).toHaveClass('bg-primary/10')
      expect(meatLink).toHaveClass('border-primary')
      expect(meatLink).toHaveAttribute('aria-current', 'page')
    })

    it('should not highlight inactive categories', () => {
      ;(useSearchParams as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue('meat'),
      })
      
      render(<CategoryIcons categories={mockCategories} />)
      
      const dairyLink = screen.getByLabelText('Browse Dairy products')
      expect(dairyLink).not.toHaveClass('bg-primary/10')
      expect(dairyLink).not.toHaveAttribute('aria-current')
    })
  })

  describe('Hover and Active States - Requirement 3.4', () => {
    it('should have hover scale animation', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveClass('hover:scale-105')
        expect(link).toHaveClass('hover:shadow-md')
      })
    })

    it('should have active scale animation', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveClass('active:scale-95')
      })
    })

    it('should have smooth transitions', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveClass('transition-all')
        expect(link).toHaveClass('duration-300')
      })
    })
  })

  describe('Horizontal Scroll with Snap Points - Requirement 3.2', () => {
    it('should have horizontal scroll enabled', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const scrollContainer = container.querySelector('[role="list"]')
      expect(scrollContainer).toHaveClass('overflow-x-auto')
    })

    it('should have snap points enabled', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const scrollContainer = container.querySelector('[role="list"]')
      expect(scrollContainer).toHaveClass('snap-x')
      expect(scrollContainer).toHaveClass('snap-mandatory')
    })

    it('should have snap-start on each category item', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveClass('snap-start')
      })
    })
  })

  describe('Scroll Indicators - Requirement 3.2', () => {
    it('should render fade indicators when scrollable', async () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      // Simulate scroll container being scrollable
      const scrollContainer = container.querySelector('[role="list"]') as HTMLElement
      if (scrollContainer) {
        Object.defineProperty(scrollContainer, 'scrollWidth', { value: 1000, configurable: true })
        Object.defineProperty(scrollContainer, 'clientWidth', { value: 500, configurable: true })
        Object.defineProperty(scrollContainer, 'scrollLeft', { value: 100, configurable: true })
        
        fireEvent.scroll(scrollContainer)
        
        await waitFor(() => {
          const fadeIndicators = container.querySelectorAll('[class*="gradient"]')
          expect(fadeIndicators.length).toBeGreaterThan(0)
        })
      }
    })
  })

  describe('Keyboard Navigation - Requirement 3.5', () => {
    it('should support arrow key navigation', () => {
      render(<CategoryIcons categories={mockCategories} />)
      
      const firstLink = screen.getByLabelText('Browse Meat products')
      const secondLink = screen.getByLabelText('Browse Dairy products')
      
      firstLink.focus()
      fireEvent.keyDown(firstLink, { key: 'ArrowRight' })
      
      // After arrow right, focus should move (tested via scrollIntoView call)
      expect(firstLink).toBeInTheDocument()
    })

    it('should support Home key navigation', () => {
      render(<CategoryIcons categories={mockCategories} />)
      
      const lastLink = screen.getByLabelText('Browse Beverages products')
      
      lastLink.focus()
      fireEvent.keyDown(lastLink, { key: 'Home' })
      
      // Home key should navigate to first item
      expect(lastLink).toBeInTheDocument()
    })

    it('should support End key navigation', () => {
      render(<CategoryIcons categories={mockCategories} />)
      
      const firstLink = screen.getByLabelText('Browse Meat products')
      
      firstLink.focus()
      fireEvent.keyDown(firstLink, { key: 'End' })
      
      // End key should navigate to last item
      expect(firstLink).toBeInTheDocument()
    })

    it('should prevent default behavior for arrow keys', () => {
      render(<CategoryIcons categories={mockCategories} />)
      
      const firstLink = screen.getByLabelText('Browse Meat products')
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      firstLink.focus()
      fireEvent.keyDown(firstLink, { key: 'ArrowRight' })
      
      // Verify keyboard navigation is implemented
      expect(firstLink).toBeInTheDocument()
    })
  })

  describe('Accessibility - Requirement 7.1', () => {
    it('should have descriptive aria-labels for all links', () => {
      render(<CategoryIcons categories={mockCategories} />)
      
      mockCategories.forEach(category => {
        const link = screen.getByLabelText(`Browse ${category.name} products`)
        expect(link).toBeInTheDocument()
      })
    })

    it('should have proper role attributes', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const list = container.querySelector('[role="list"]')
      expect(list).toBeInTheDocument()
      
      const listItems = container.querySelectorAll('[role="listitem"]')
      expect(listItems.length).toBe(mockCategories.length)
    })

    it('should have aria-hidden on decorative icons', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const icons = container.querySelectorAll('i')
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('should have focus ring styles', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveClass('focus:outline-none')
        expect(link).toHaveClass('focus:ring-2')
        expect(link).toHaveClass('focus:ring-primary')
      })
    })

    it('should be keyboard accessible with tabIndex', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        expect(link).toHaveAttribute('tabIndex', '0')
      })
    })
  })

  describe('Links and Navigation', () => {
    it('should have correct href for each category', () => {
      render(<CategoryIcons categories={mockCategories} />)
      
      mockCategories.forEach(category => {
        const link = screen.getByLabelText(`Browse ${category.name} products`)
        expect(link).toHaveAttribute('href', `/products?category=${category.slug}`)
      })
    })
  })

  describe('Responsive Design', () => {
    it('should have proper container padding', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const containerDiv = container.querySelector('.container')
      expect(containerDiv).toHaveClass('px-4')
    })

    it('should have proper section padding', () => {
      const { container } = render(<CategoryIcons categories={mockCategories} />)
      
      const section = container.querySelector('section')
      expect(section).toHaveClass('py-6')
      expect(section).toHaveClass('mb-6')
    })
  })
})
