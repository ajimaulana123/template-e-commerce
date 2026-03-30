/**
 * Unit tests for animation utilities
 * Requirements: 6.1, 6.2, 6.6
 */

import {
  getStaggerDelay,
  getMotionSafeClasses,
  shouldEnableAnimations,
  getFadeInClass,
  getScaleInClass,
  getSlideInClass,
  applyStaggeredAnimation,
  enableGPUAcceleration,
  disableGPUAcceleration,
  createScrollObserver,
  animateOnScroll,
} from '../animations'

// Mock the design tokens
jest.mock('@/lib/design-tokens', () => ({
  tokens: {
    animation: {
      duration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
    },
  },
  a11y: {
    prefersReducedMotion: jest.fn(),
  },
}))

import { a11y } from '@/lib/design-tokens'

const mockPrefersReducedMotion = a11y.prefersReducedMotion as jest.MockedFunction<
  typeof a11y.prefersReducedMotion
>

describe('Animation Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPrefersReducedMotion.mockReturnValue(false)
  })

  describe('getStaggerDelay', () => {
    it('should calculate delay based on index and base delay', () => {
      expect(getStaggerDelay(0, 100)).toBe('0ms')
      expect(getStaggerDelay(1, 100)).toBe('100ms')
      expect(getStaggerDelay(2, 100)).toBe('200ms')
      expect(getStaggerDelay(5, 100)).toBe('500ms')
    })

    it('should use default base delay of 100ms', () => {
      expect(getStaggerDelay(0)).toBe('0ms')
      expect(getStaggerDelay(1)).toBe('100ms')
      expect(getStaggerDelay(3)).toBe('300ms')
    })

    it('should work with custom base delays', () => {
      expect(getStaggerDelay(2, 50)).toBe('100ms')
      expect(getStaggerDelay(3, 200)).toBe('600ms')
    })

    it('should handle zero index', () => {
      expect(getStaggerDelay(0, 100)).toBe('0ms')
    })
  })

  describe('getMotionSafeClasses', () => {
    it('should return animation classes when motion is not reduced', () => {
      mockPrefersReducedMotion.mockReturnValue(false)

      const result = getMotionSafeClasses('animate-fade-in')
      expect(result).toBe('animate-fade-in')
    })

    it('should return empty string when motion is reduced', () => {
      mockPrefersReducedMotion.mockReturnValue(true)

      const result = getMotionSafeClasses('animate-fade-in')
      expect(result).toBe('')
    })

    it('should handle multiple classes', () => {
      mockPrefersReducedMotion.mockReturnValue(false)

      const result = getMotionSafeClasses('animate-fade-in animate-slide-up')
      expect(result).toBe('animate-fade-in animate-slide-up')
    })

    it('should return animation classes on server side for SSR', () => {
      const originalWindow = global.window
      ;(global as any).window = undefined

      const result = getMotionSafeClasses('animate-fade-in')
      // On server side, return classes for SSR (client will handle motion preference)
      expect(result).toBe('animate-fade-in')

      global.window = originalWindow
    })
  })

  describe('shouldEnableAnimations', () => {
    it('should return true when motion is not reduced', () => {
      mockPrefersReducedMotion.mockReturnValue(false)

      expect(shouldEnableAnimations()).toBe(true)
    })

    it('should return false when motion is reduced', () => {
      mockPrefersReducedMotion.mockReturnValue(true)

      expect(shouldEnableAnimations()).toBe(false)
    })

    it('should return true on server side', () => {
      const originalWindow = global.window
      ;(global as any).window = undefined

      expect(shouldEnableAnimations()).toBe(true)

      global.window = originalWindow
    })
  })

  describe('getFadeInClass', () => {
    it('should return fade-in-up class for up direction', () => {
      expect(getFadeInClass('up')).toBe('animate-fade-in-up')
    })

    it('should return fade-in-down class for down direction', () => {
      expect(getFadeInClass('down')).toBe('animate-fade-in-down')
    })

    it('should return fade-in-left class for left direction', () => {
      expect(getFadeInClass('left')).toBe('animate-fade-in-left')
    })

    it('should return fade-in-right class for right direction', () => {
      expect(getFadeInClass('right')).toBe('animate-fade-in-right')
    })

    it('should return basic fade-in class when no direction specified', () => {
      expect(getFadeInClass()).toBe('animate-fade-in')
    })

    it('should return empty string when animations are disabled', () => {
      mockPrefersReducedMotion.mockReturnValue(true)

      expect(getFadeInClass('up')).toBe('')
      expect(getFadeInClass()).toBe('')
    })
  })

  describe('getScaleInClass', () => {
    it('should return scale-in class', () => {
      expect(getScaleInClass()).toBe('animate-scale-in')
    })

    it('should return empty string when animations are disabled', () => {
      mockPrefersReducedMotion.mockReturnValue(true)

      expect(getScaleInClass()).toBe('')
    })
  })

  describe('getSlideInClass', () => {
    it('should return slide-in-left class for left direction', () => {
      expect(getSlideInClass('left')).toBe('animate-slide-in-left')
    })

    it('should return slide-in-right class for right direction', () => {
      expect(getSlideInClass('right')).toBe('animate-slide-in-right')
    })

    it('should return empty string when animations are disabled', () => {
      mockPrefersReducedMotion.mockReturnValue(true)

      expect(getSlideInClass('left')).toBe('')
      expect(getSlideInClass('right')).toBe('')
    })
  })

  describe('applyStaggeredAnimation', () => {
    it('should apply animation delays to elements', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ]

      applyStaggeredAnimation(elements, 0, 100)

      expect(elements[0].style.animationDelay).toBe('0ms')
      expect(elements[1].style.animationDelay).toBe('100ms')
      expect(elements[2].style.animationDelay).toBe('200ms')
    })

    it('should apply base delay to all elements', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
      ]

      applyStaggeredAnimation(elements, 200, 100)

      expect(elements[0].style.animationDelay).toBe('200ms')
      expect(elements[1].style.animationDelay).toBe('300ms')
    })

    it('should handle empty array', () => {
      expect(() => {
        applyStaggeredAnimation([], 0, 100)
      }).not.toThrow()
    })

    it('should handle single element', () => {
      const elements = [document.createElement('div')]

      applyStaggeredAnimation(elements, 100, 50)

      expect(elements[0].style.animationDelay).toBe('100ms')
    })
  })

  describe('enableGPUAcceleration', () => {
    it('should set transform and willChange properties', () => {
      const element = document.createElement('div')

      enableGPUAcceleration(element)

      expect(element.style.transform).toBe('translateZ(0)')
      expect(element.style.willChange).toBe('transform, opacity')
    })
  })

  describe('disableGPUAcceleration', () => {
    it('should reset willChange property', () => {
      const element = document.createElement('div')
      element.style.willChange = 'transform, opacity'

      disableGPUAcceleration(element)

      expect(element.style.willChange).toBe('auto')
    })
  })

  describe('createScrollObserver', () => {
    let mockObserve: jest.Mock
    let mockDisconnect: jest.Mock
    let mockIntersectionObserver: jest.Mock

    beforeEach(() => {
      mockObserve = jest.fn()
      mockDisconnect = jest.fn()
      mockIntersectionObserver = jest.fn((callback) => ({
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: () => [],
      }))

      global.IntersectionObserver = mockIntersectionObserver as any
    })

    it('should create IntersectionObserver with default options', () => {
      const callback = jest.fn()
      const observer = createScrollObserver(callback)

      expect(observer).toBeTruthy()
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px',
        })
      )
    })

    it('should create IntersectionObserver with custom options', () => {
      const callback = jest.fn()
      const options = {
        threshold: 0.5,
        rootMargin: '50px',
      }

      createScrollObserver(callback, options)

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining(options)
      )
    })

    it('should call callback when element intersects', () => {
      const callback = jest.fn()
      let observerCallback: IntersectionObserverCallback

      mockIntersectionObserver.mockImplementation((cb) => {
        observerCallback = cb
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: jest.fn(),
          root: null,
          rootMargin: '',
          thresholds: [],
          takeRecords: () => [],
        }
      })

      createScrollObserver(callback)

      const mockEntry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
        target: document.createElement('div'),
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      }

      observerCallback!([mockEntry as IntersectionObserverEntry], {} as IntersectionObserver)

      expect(callback).toHaveBeenCalledWith(mockEntry)
    })

    it('should return null when IntersectionObserver is not supported', () => {
      const originalIO = global.IntersectionObserver
      ;(global as any).IntersectionObserver = undefined

      const callback = jest.fn()
      const observer = createScrollObserver(callback)

      expect(observer).toBeNull()

      global.IntersectionObserver = originalIO
    })
  })

  describe('animateOnScroll', () => {
    let mockObserve: jest.Mock
    let mockDisconnect: jest.Mock
    let mockIntersectionObserver: jest.Mock

    beforeEach(() => {
      mockObserve = jest.fn()
      mockDisconnect = jest.fn()
      mockIntersectionObserver = jest.fn((callback) => ({
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: () => [],
      }))

      global.IntersectionObserver = mockIntersectionObserver as any
    })

    it('should add animation class when element scrolls into view', () => {
      let observerCallback: IntersectionObserverCallback

      mockIntersectionObserver.mockImplementation((cb) => {
        observerCallback = cb
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: jest.fn(),
          root: null,
          rootMargin: '',
          thresholds: [],
          takeRecords: () => [],
        }
      })

      const element = document.createElement('div')
      animateOnScroll(element, 'animate-fade-in')

      expect(mockObserve).toHaveBeenCalledWith(element)

      const mockEntry: Partial<IntersectionObserverEntry> = {
        isIntersecting: true,
        target: element,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      }

      observerCallback!([mockEntry as IntersectionObserverEntry], {} as IntersectionObserver)

      expect(element.classList.contains('animate-fade-in')).toBe(true)
    })

    it('should return cleanup function that disconnects observer', () => {
      const element = document.createElement('div')
      const cleanup = animateOnScroll(element, 'animate-fade-in')

      cleanup()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should add class immediately when animations are disabled', () => {
      mockPrefersReducedMotion.mockReturnValue(true)

      const element = document.createElement('div')
      animateOnScroll(element, 'animate-fade-in')

      expect(element.classList.contains('animate-fade-in')).toBe(true)
      expect(mockObserve).not.toHaveBeenCalled()
    })

    it('should add class immediately when IntersectionObserver is not supported', () => {
      const originalIO = global.IntersectionObserver
      ;(global as any).IntersectionObserver = undefined

      const element = document.createElement('div')
      animateOnScroll(element, 'animate-fade-in')

      expect(element.classList.contains('animate-fade-in')).toBe(true)

      global.IntersectionObserver = originalIO
    })

    it('should accept custom observer options', () => {
      const element = document.createElement('div')
      const options = {
        threshold: 0.5,
        rootMargin: '50px',
      }

      animateOnScroll(element, 'animate-fade-in', options)

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining(options)
      )
    })
  })
})
