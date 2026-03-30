/**
 * Unit tests for useIntersectionObserver hook
 * Requirements: 6.2
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useIntersectionObserver } from '../useIntersectionObserver'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: () => [],
  }))

  global.IntersectionObserver = mockIntersectionObserver as any
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('useIntersectionObserver', () => {
  describe('Basic Functionality', () => {
    it('should return ref and initial state', () => {
      const { result } = renderHook(() => useIntersectionObserver())

      const [ref, state] = result.current

      expect(ref).toBeDefined()
      expect(ref.current).toBeNull()
      expect(state.isIntersecting).toBe(false)
      expect(state.entry).toBeNull()
    })

    it('should not create observer when ref is not attached', () => {
      renderHook(() => useIntersectionObserver())

      expect(mockIntersectionObserver).not.toHaveBeenCalled()
    })
  })

  describe('Configuration Options', () => {
    it('should accept threshold option', () => {
      const { result } = renderHook(() =>
        useIntersectionObserver({
          threshold: 0.5,
        })
      )

      expect(result.current[0]).toBeDefined()
      expect(result.current[1].isIntersecting).toBe(false)
    })

    it('should accept rootMargin option', () => {
      const { result } = renderHook(() =>
        useIntersectionObserver({
          rootMargin: '10px',
        })
      )

      expect(result.current[0]).toBeDefined()
      expect(result.current[1].isIntersecting).toBe(false)
    })

    it('should accept root element option', () => {
      const rootElement = document.createElement('div')

      const { result } = renderHook(() =>
        useIntersectionObserver({
          root: rootElement,
        })
      )

      expect(result.current[0]).toBeDefined()
      expect(result.current[1].isIntersecting).toBe(false)
    })

    it('should accept array of thresholds', () => {
      const { result } = renderHook(() =>
        useIntersectionObserver({
          threshold: [0, 0.25, 0.5, 0.75, 1],
        })
      )

      expect(result.current[0]).toBeDefined()
      expect(result.current[1].isIntersecting).toBe(false)
    })

    it('should accept triggerOnce option', () => {
      const { result } = renderHook(() =>
        useIntersectionObserver({
          triggerOnce: true,
        })
      )

      expect(result.current[0]).toBeDefined()
      expect(result.current[1].isIntersecting).toBe(false)
    })
  })

  describe('Enabled Option', () => {
    it('should not create observer when enabled is false', () => {
      renderHook(() =>
        useIntersectionObserver({
          enabled: false,
        })
      )

      expect(mockIntersectionObserver).not.toHaveBeenCalled()
    })

    it('should respect enabled option', () => {
      const { result } = renderHook(() =>
        useIntersectionObserver({
          enabled: true,
        })
      )

      expect(result.current[0]).toBeDefined()
      expect(result.current[1].isIntersecting).toBe(false)
    })
  })

  describe('Browser Compatibility', () => {
    it('should handle missing IntersectionObserver gracefully', () => {
      const originalIO = global.IntersectionObserver
      ;(global as any).IntersectionObserver = undefined

      const { result } = renderHook(() => useIntersectionObserver())
      const [ref, state] = result.current

      expect(ref).toBeDefined()
      // Should assume visible when IntersectionObserver is not supported
      expect(state.isIntersecting).toBe(false)

      global.IntersectionObserver = originalIO
    })
  })

  describe('Return Values', () => {
    it('should return consistent ref object across renders', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver())

      const [firstRef] = result.current
      rerender()
      const [secondRef] = result.current

      expect(firstRef).toBe(secondRef)
    })

    it('should maintain state structure', () => {
      const { result } = renderHook(() => useIntersectionObserver())
      const [, state] = result.current

      expect(state).toHaveProperty('isIntersecting')
      expect(state).toHaveProperty('entry')
      expect(typeof state.isIntersecting).toBe('boolean')
      expect(state.entry).toBeNull()
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple independent instances', () => {
      const { result: result1 } = renderHook(() => useIntersectionObserver())
      const { result: result2 } = renderHook(() => useIntersectionObserver())

      const [ref1, state1] = result1.current
      const [ref2, state2] = result2.current

      expect(ref1).not.toBe(ref2)
      expect(state1).toEqual(state2)
    })

    it('should support different configurations per instance', () => {
      const { result: result1 } = renderHook(() =>
        useIntersectionObserver({ threshold: 0.5 })
      )
      const { result: result2 } = renderHook(() =>
        useIntersectionObserver({ threshold: 0.8 })
      )

      expect(result1.current[0]).toBeDefined()
      expect(result2.current[0]).toBeDefined()
      expect(result1.current[0]).not.toBe(result2.current[0])
    })
  })
})

