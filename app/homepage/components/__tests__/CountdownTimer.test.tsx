import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import CountdownTimer from '../CountdownTimer'

// Mock timers
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

describe('CountdownTimer Component', () => {
  describe('Time Display', () => {
    it('should display hours, minutes, and seconds', () => {
      const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      render(<CountdownTimer endTime={futureTime} />)

      expect(screen.getByText('Jam')).toBeInTheDocument()
      expect(screen.getByText('Menit')).toBeInTheDocument()
      expect(screen.getByText('Detik')).toBeInTheDocument()
    })

    it('should display days when time remaining is more than 24 hours', () => {
      const futureTime = new Date(Date.now() + 25 * 60 * 60 * 1000) // 25 hours from now
      render(<CountdownTimer endTime={futureTime} />)

      expect(screen.getByText('Hari')).toBeInTheDocument()
      expect(screen.getByText('Jam')).toBeInTheDocument()
      expect(screen.getByText('Menit')).toBeInTheDocument()
      expect(screen.getByText('Detik')).toBeInTheDocument()
    })

    it('should not display days when time remaining is less than 24 hours', () => {
      const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
      render(<CountdownTimer endTime={futureTime} />)

      expect(screen.queryByText('Hari')).not.toBeInTheDocument()
    })

    it('should pad single digit numbers with leading zero', () => {
      const futureTime = new Date(Date.now() + 5 * 1000) // 5 seconds from now
      render(<CountdownTimer endTime={futureTime} />)

      // Should show 00:00:05 format
      const timeElements = screen.getAllByText(/^\d{2}$/)
      expect(timeElements.length).toBeGreaterThan(0)
    })
  })

  describe('Timer Updates', () => {
    it('should update every second', async () => {
      const futureTime = new Date(Date.now() + 10 * 1000) // 10 seconds from now
      render(<CountdownTimer endTime={futureTime} />)

      // Get initial seconds value
      const initialTimer = screen.getByRole('timer')
      const initialLabel = initialTimer.getAttribute('aria-label')

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Wait for update
      await waitFor(() => {
        const updatedTimer = screen.getByRole('timer')
        const updatedLabel = updatedTimer.getAttribute('aria-label')
        expect(updatedLabel).not.toBe(initialLabel)
      })
    })

    it('should countdown correctly', async () => {
      const futureTime = new Date(Date.now() + 3 * 1000) // 3 seconds from now
      render(<CountdownTimer endTime={futureTime} />)

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        const timer = screen.getByRole('timer')
        const label = timer.getAttribute('aria-label')
        expect(label).toContain('2 detik')
      })
    })
  })

  describe('Expiration Handling', () => {
    it('should call onExpire callback when timer reaches zero', async () => {
      const onExpire = jest.fn()
      const futureTime = new Date(Date.now() + 1000) // 1 second from now

      render(<CountdownTimer endTime={futureTime} onExpire={onExpire} />)

      // Advance time past expiration
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(onExpire).toHaveBeenCalledTimes(1)
      })
    })

    it('should display expiration message when timer expires', async () => {
      const futureTime = new Date(Date.now() + 1000) // 1 second from now

      render(<CountdownTimer endTime={futureTime} />)

      // Advance time past expiration
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(screen.getByText('Sale Berakhir!')).toBeInTheDocument()
      })
    })

    it('should stop updating after expiration', async () => {
      const onExpire = jest.fn()
      const futureTime = new Date(Date.now() + 1000) // 1 second from now

      render(<CountdownTimer endTime={futureTime} onExpire={onExpire} />)

      // Advance time past expiration
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(onExpire).toHaveBeenCalledTimes(1)
      })

      // Advance more time
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      // Should still only be called once
      expect(onExpire).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have aria-live="polite" for screen reader updates', () => {
      const futureTime = new Date(Date.now() + 10 * 1000)
      render(<CountdownTimer endTime={futureTime} />)

      const timer = screen.getByRole('timer')
      expect(timer).toHaveAttribute('aria-live', 'polite')
    })

    it('should have aria-atomic="true" for complete announcements', () => {
      const futureTime = new Date(Date.now() + 10 * 1000)
      render(<CountdownTimer endTime={futureTime} />)

      const timer = screen.getByRole('timer')
      expect(timer).toHaveAttribute('aria-atomic', 'true')
    })

    it('should have descriptive aria-label', () => {
      const futureTime = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
      render(<CountdownTimer endTime={futureTime} />)

      const timer = screen.getByRole('timer')
      const label = timer.getAttribute('aria-label')
      expect(label).toContain('Time remaining')
      expect(label).toContain('jam')
      expect(label).toContain('menit')
      expect(label).toContain('detik')
    })

    it('should hide separator colons from screen readers', () => {
      const futureTime = new Date(Date.now() + 10 * 1000)
      const { container } = render(<CountdownTimer endTime={futureTime} />)

      const separators = container.querySelectorAll('[aria-hidden="true"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Size Variants', () => {
    it('should render small size variant', () => {
      const futureTime = new Date(Date.now() + 10 * 1000)
      const { container } = render(<CountdownTimer endTime={futureTime} size="sm" />)

      expect(container.querySelector('.text-lg')).toBeInTheDocument()
    })

    it('should render medium size variant (default)', () => {
      const futureTime = new Date(Date.now() + 10 * 1000)
      const { container } = render(<CountdownTimer endTime={futureTime} />)

      expect(container.querySelector('.text-2xl')).toBeInTheDocument()
    })

    it('should render large size variant', () => {
      const futureTime = new Date(Date.now() + 10 * 1000)
      const { container } = render(<CountdownTimer endTime={futureTime} size="lg" />)

      expect(container.querySelector('.text-3xl')).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      const futureTime = new Date(Date.now() + 10 * 1000)
      const { container } = render(
        <CountdownTimer endTime={futureTime} className="custom-class" />
      )

      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle past end time gracefully', () => {
      const pastTime = new Date(Date.now() - 1000) // 1 second ago
      render(<CountdownTimer endTime={pastTime} />)

      expect(screen.getByText('Sale Berakhir!')).toBeInTheDocument()
    })

    it('should handle very large time differences', () => {
      const futureTime = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      render(<CountdownTimer endTime={futureTime} />)

      expect(screen.getByText('Hari')).toBeInTheDocument()
      expect(screen.getByText('Jam')).toBeInTheDocument()
      expect(screen.getByText('Menit')).toBeInTheDocument()
      expect(screen.getByText('Detik')).toBeInTheDocument()
    })
  })
})
