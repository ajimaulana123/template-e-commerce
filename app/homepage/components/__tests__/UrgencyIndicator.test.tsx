import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import UrgencyIndicator from '../UrgencyIndicator'

describe('UrgencyIndicator', () => {
  describe('Stock Level Indicator', () => {
    it('should display stock indicator when stock is below threshold', () => {
      render(<UrgencyIndicator stockRemaining={5} />)
      
      expect(screen.getByText(/Only 5 left!/i)).toBeInTheDocument()
    })

    it('should display stock indicator at threshold boundary', () => {
      render(<UrgencyIndicator stockRemaining={10} stockThreshold={10} />)
      
      expect(screen.getByText(/Only 10 left!/i)).toBeInTheDocument()
    })

    it('should not display stock indicator when stock is above threshold', () => {
      render(<UrgencyIndicator stockRemaining={15} stockThreshold={10} />)
      
      expect(screen.queryByText(/Only.*left!/i)).not.toBeInTheDocument()
    })

    it('should not display stock indicator when stock is 0', () => {
      render(<UrgencyIndicator stockRemaining={0} />)
      
      expect(screen.queryByText(/Only.*left!/i)).not.toBeInTheDocument()
    })

    it('should use custom stock threshold', () => {
      render(<UrgencyIndicator stockRemaining={8} stockThreshold={5} />)
      
      expect(screen.queryByText(/Only.*left!/i)).not.toBeInTheDocument()
    })

    it('should have accessible label for stock indicator', () => {
      render(<UrgencyIndicator stockRemaining={3} />)
      
      const indicator = screen.getByLabelText(/Only 3 items left in stock/i)
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('View Counter', () => {
    it('should display view counter when views exceed threshold', () => {
      render(<UrgencyIndicator viewCount={100} />)
      
      expect(screen.getByText(/100 viewing/i)).toBeInTheDocument()
    })

    it('should display view counter at threshold boundary', () => {
      render(<UrgencyIndicator viewCount={50} viewThreshold={50} />)
      
      expect(screen.getByText(/50 viewing/i)).toBeInTheDocument()
    })

    it('should not display view counter when views are below threshold', () => {
      render(<UrgencyIndicator viewCount={30} viewThreshold={50} />)
      
      expect(screen.queryByText(/viewing/i)).not.toBeInTheDocument()
    })

    it('should format view count for thousands', () => {
      render(<UrgencyIndicator viewCount={1500} />)
      
      expect(screen.getByText(/1K\+ viewing/i)).toBeInTheDocument()
    })

    it('should format view count for multiple thousands', () => {
      render(<UrgencyIndicator viewCount={5800} />)
      
      expect(screen.getByText(/5K\+ viewing/i)).toBeInTheDocument()
    })

    it('should use custom view threshold', () => {
      render(<UrgencyIndicator viewCount={75} viewThreshold={100} />)
      
      expect(screen.queryByText(/viewing/i)).not.toBeInTheDocument()
    })

    it('should have accessible label for view counter', () => {
      render(<UrgencyIndicator viewCount={150} />)
      
      const indicator = screen.getByLabelText(/150 people viewing this product/i)
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('Combined Indicators', () => {
    it('should display both indicators when both conditions are met', () => {
      render(<UrgencyIndicator stockRemaining={5} viewCount={100} />)
      
      expect(screen.getByText(/Only 5 left!/i)).toBeInTheDocument()
      expect(screen.getByText(/100 viewing/i)).toBeInTheDocument()
    })

    it('should display only stock indicator when view count is below threshold', () => {
      render(<UrgencyIndicator stockRemaining={5} viewCount={30} />)
      
      expect(screen.getByText(/Only 5 left!/i)).toBeInTheDocument()
      expect(screen.queryByText(/viewing/i)).not.toBeInTheDocument()
    })

    it('should display only view counter when stock is above threshold', () => {
      render(<UrgencyIndicator stockRemaining={20} viewCount={100} />)
      
      expect(screen.queryByText(/Only.*left!/i)).not.toBeInTheDocument()
      expect(screen.getByText(/100 viewing/i)).toBeInTheDocument()
    })
  })

  describe('Conditional Rendering', () => {
    it('should return null when no indicators should be shown', () => {
      const { container } = render(
        <UrgencyIndicator stockRemaining={20} viewCount={30} />
      )
      
      expect(container.firstChild).toBeNull()
    })

    it('should return null when no props are provided', () => {
      const { container } = render(<UrgencyIndicator />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should return null when stock is undefined and views are below threshold', () => {
      const { container } = render(<UrgencyIndicator viewCount={30} />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Variants', () => {
    it('should apply compact variant styles by default', () => {
      render(<UrgencyIndicator stockRemaining={5} />)
      
      const indicator = screen.getByText(/Only 5 left!/i).parentElement
      expect(indicator).toHaveClass('px-2', 'py-1', 'text-xs')
    })

    it('should apply detailed variant styles when specified', () => {
      render(<UrgencyIndicator stockRemaining={5} variant="detailed" />)
      
      const indicator = screen.getByText(/Only 5 left!/i).parentElement
      expect(indicator).toHaveClass('px-3', 'py-1.5', 'text-sm')
    })
  })

  describe('Accessibility', () => {
    it('should have role="status" on container', () => {
      render(<UrgencyIndicator stockRemaining={5} />)
      
      const container = screen.getByRole('status')
      expect(container).toBeInTheDocument()
    })

    it('should have aria-live="polite" on container', () => {
      render(<UrgencyIndicator stockRemaining={5} />)
      
      const container = screen.getByRole('status')
      expect(container).toHaveAttribute('aria-live', 'polite')
    })

    it('should hide icons from screen readers', () => {
      const { container } = render(<UrgencyIndicator stockRemaining={5} viewCount={100} />)
      
      const icons = container.querySelectorAll('svg')
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<UrgencyIndicator stockRemaining={5} className="custom-class" />)
      
      const container = screen.getByRole('status')
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('Edge Cases', () => {
    it('should handle stock remaining of 1', () => {
      render(<UrgencyIndicator stockRemaining={1} />)
      
      expect(screen.getByText(/Only 1 left!/i)).toBeInTheDocument()
    })

    it('should handle exactly 1000 views', () => {
      render(<UrgencyIndicator viewCount={1000} />)
      
      expect(screen.getByText(/1K\+ viewing/i)).toBeInTheDocument()
    })

    it('should handle 999 views without K formatting', () => {
      render(<UrgencyIndicator viewCount={999} />)
      
      expect(screen.getByText(/999 viewing/i)).toBeInTheDocument()
    })

    it('should handle negative stock gracefully', () => {
      const { container } = render(<UrgencyIndicator stockRemaining={-5} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should handle zero threshold', () => {
      render(<UrgencyIndicator stockRemaining={0} stockThreshold={0} />)
      
      expect(screen.queryByText(/Only.*left!/i)).not.toBeInTheDocument()
    })
  })
})
