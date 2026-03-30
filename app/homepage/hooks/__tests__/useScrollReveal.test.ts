/**
 * Unit tests for useScrollReveal hook
 * Requirements: 6.1, 6.2, 6.6
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { useScrollReveal, useStaggeredScrollReveal } from '../useScrollReveal'

// Mock the useIntersectionObserver hook
jest.mock('../useIntersectionObserver', () => ({
  useIntersectionObserver: jest.fn(),
}))

// Mock the animations utility
jest.mock('../../utils/animations', () => ({
  getMotionSafeClasses: jest.fn((classes) => classes),
}))

import { useIntersectionObserver } from '../useIntersectionObserver'
import { getMotionSafeClasses } from '../../utils/animations'

const mockUseIntersectionObserver = useIntersectionObserver as jest.MockedFunction<
  typeof useIntersectionObserver
>
const mockGetMotionSafeClasses = getMotionSafeClasses as jest.MockedFunction<
  typeof getMotionSafeClasses
>

describe('useScrollReveal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    // Default mock implementation
    mockUseIntersectionObserver.mockReturnValue([
      { current: null } as any,
      { isIntersecting: false, entry: null },
    ])

    mockGetMotionSafeClasses.mockImplementation((classes) => classes)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Basic Functionality', () => {
    it('should return ref, isVisible state, and animationClasses', () => {
      const { result } = renderHook(() => useScrollReveal())

      expect(result.current).toHaveProperty('ref')
      expect(result.current).toHaveProperty('isVisible')
      expect(result.current).toHaveProperty('animationClasses')
    })

    it('should start with isVisible false', () => {
      const { result } = renderHook(() => useScrollReveal())

      expect(result.current.isVisible).toBe(false)
    })

    it('should start with opacity-0 class when not visible', () => {
      const { result } = renderHook(() => useScrollReveal())

      expect(result.current.animationClasses).toBe('opacity-0')
    })

    it('should call useIntersectionObserver with default options', () => {
      renderHook(() => useScrollReveal())

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith({
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
        triggerOnce: true,
        enabled: true,
      })
    })
  })

  describe('Intersection Behavior', () => {
    it('should set isVisible to true when element intersects', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() => useScrollReveal())

      await waitFor(() => {
        expect(result.current.isVisible).toBe(true)
      })
    })

    it('should apply animation class when visible', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() => useScrollReveal())

      await waitFor(() => {
        expect(result.current.animationClasses).toBe('animate-fade-in-up')
      })
    })

    it('should use custom animation class when provided', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() =>
        useScrollReveal({
          animationClass: 'custom-animation',
        })
      )

      await waitFor(() => {
        expect(result.current.animationClasses).toBe('custom-animation')
      })
    })
  })

  describe('Delay Functionality', () => {
    it('should apply animation immediately when delay is 0', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() =>
        useScrollReveal({
          delay: 0,
        })
      )

      await waitFor(() => {
        expect(result.current.isVisible).toBe(true)
      })
    })

    it('should delay animation when delay is specified', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() =>
        useScrollReveal({
          delay: 500,
        })
      )

      // Should not be visible immediately
      expect(result.current.isVisible).toBe(false)

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(500)
      })

      await waitFor(() => {
        expect(result.current.isVisible).toBe(true)
      })
    })

    it('should not apply animation if delay has not elapsed', () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() =>
        useScrollReveal({
          delay: 1000,
        })
      )

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(result.current.isVisible).toBe(false)
    })

    it('should cleanup timeout on unmount', () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { unmount } = renderHook(() =>
        useScrollReveal({
          delay: 1000,
        })
      )

      unmount()

      // Should not throw error
      expect(() => {
        jest.advanceTimersByTime(1000)
      }).not.toThrow()
    })
  })

  describe('Custom Options', () => {
    it('should pass custom threshold to useIntersectionObserver', () => {
      renderHook(() =>
        useScrollReveal({
          threshold: 0.5,
        })
      )

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
        expect.objectContaining({
          threshold: 0.5,
        })
      )
    })

    it('should pass custom rootMargin to useIntersectionObserver', () => {
      renderHook(() =>
        useScrollReveal({
          rootMargin: '50px',
        })
      )

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
        expect.objectContaining({
          rootMargin: '50px',
        })
      )
    })

    it('should pass triggerOnce option to useIntersectionObserver', () => {
      renderHook(() =>
        useScrollReveal({
          triggerOnce: false,
        })
      )

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
        expect.objectContaining({
          triggerOnce: false,
        })
      )
    })

    it('should pass enabled option to useIntersectionObserver', () => {
      renderHook(() =>
        useScrollReveal({
          enabled: false,
        })
      )

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        })
      )
    })
  })

  describe('Motion Preference Support', () => {
    it('should call getMotionSafeClasses when visible', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      renderHook(() => useScrollReveal())

      await waitFor(() => {
        expect(mockGetMotionSafeClasses).toHaveBeenCalledWith('animate-fade-in-up')
      })
    })

    it('should respect reduced motion preference', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      mockGetMotionSafeClasses.mockReturnValue('')

      const { result } = renderHook(() => useScrollReveal())

      await waitFor(() => {
        expect(result.current.animationClasses).toBe('')
      })
    })
  })
})

describe('useStaggeredScrollReveal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockUseIntersectionObserver.mockReturnValue([
      { current: null } as any,
      { isIntersecting: false, entry: null },
    ])

    mockGetMotionSafeClasses.mockImplementation((classes) => classes)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Stagger Delay Calculation', () => {
    it('should add stagger delay based on index', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() => useStaggeredScrollReveal(2))

      // Index 2 should have 200ms delay (2 * 100ms)
      expect(result.current.isVisible).toBe(false)

      act(() => {
        jest.advanceTimersByTime(200)
      })

      await waitFor(() => {
        expect(result.current.isVisible).toBe(true)
      })
    })

    it('should combine base delay with stagger delay', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() =>
        useStaggeredScrollReveal(1, {
          delay: 100,
        })
      )

      // Base delay 100ms + stagger delay 100ms (1 * 100ms) = 200ms total
      expect(result.current.isVisible).toBe(false)

      act(() => {
        jest.advanceTimersByTime(200)
      })

      await waitFor(() => {
        expect(result.current.isVisible).toBe(true)
      })
    })

    it('should have no delay for index 0', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result } = renderHook(() => useStaggeredScrollReveal(0))

      await waitFor(() => {
        expect(result.current.isVisible).toBe(true)
      })
    })

    it('should pass through other options', () => {
      renderHook(() =>
        useStaggeredScrollReveal(1, {
          threshold: 0.5,
          animationClass: 'custom-animation',
        })
      )

      expect(mockUseIntersectionObserver).toHaveBeenCalledWith(
        expect.objectContaining({
          threshold: 0.5,
        })
      )
    })
  })

  describe('Multiple Elements Staggering', () => {
    it('should create different delays for different indices', async () => {
      mockUseIntersectionObserver.mockReturnValue([
        { current: null } as any,
        { isIntersecting: true, entry: null },
      ])

      const { result: result0 } = renderHook(() => useStaggeredScrollReveal(0))
      const { result: result1 } = renderHook(() => useStaggeredScrollReveal(1))
      const { result: result2 } = renderHook(() => useStaggeredScrollReveal(2))

      // Index 0 should be visible immediately
      await waitFor(() => {
        expect(result0.current.isVisible).toBe(true)
      })

      // Index 1 should not be visible yet
      expect(result1.current.isVisible).toBe(false)
      expect(result2.current.isVisible).toBe(false)

      // Advance by 100ms
      act(() => {
        jest.advanceTimersByTime(100)
      })

      // Index 1 should now be visible
      await waitFor(() => {
        expect(result1.current.isVisible).toBe(true)
      })

      // Index 2 should not be visible yet
      expect(result2.current.isVisible).toBe(false)

      // Advance by another 100ms
      act(() => {
        jest.advanceTimersByTime(100)
      })

      // Index 2 should now be visible
      await waitFor(() => {
        expect(result2.current.isVisible).toBe(true)
      })
    })
  })
})
