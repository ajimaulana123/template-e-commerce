/**
 * useScrollReveal Hook
 * Specialized hook for scroll-triggered reveal animations
 * Requirements: 6.1, 6.2, 6.6
 */

import { useEffect, useState } from 'react'
import { useIntersectionObserver, UseIntersectionObserverOptions } from './useIntersectionObserver'
import { getMotionSafeClasses } from '../utils/animations'

export interface UseScrollRevealOptions extends UseIntersectionObserverOptions {
  animationClass?: string
  delay?: number
}

export interface UseScrollRevealResult<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>
  isVisible: boolean
  animationClasses: string
}

/**
 * Hook for scroll-triggered reveal animations with motion preference support
 * @param options - Configuration for scroll reveal behavior
 * @returns Object with ref, visibility state, and animation classes
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: UseScrollRevealOptions = {}
): UseScrollRevealResult<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true,
    animationClass = 'animate-fade-in-up',
    delay = 0,
    enabled = true,
  } = options

  const [ref, { isIntersecting }] = useIntersectionObserver<T>({
    threshold,
    rootMargin,
    triggerOnce,
    enabled,
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isIntersecting) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, delay)
        return () => clearTimeout(timer)
      } else {
        setIsVisible(true)
      }
    }
  }, [isIntersecting, delay])

  // Get animation classes with motion preference check
  const animationClasses = isVisible
    ? getMotionSafeClasses(animationClass)
    : 'opacity-0'

  return {
    ref,
    isVisible,
    animationClasses,
  }
}

/**
 * Hook for staggered scroll reveal animations
 * Useful for animating lists or grids with sequential delays
 * @param index - Element index in sequence
 * @param options - Configuration for scroll reveal behavior
 * @returns Object with ref, visibility state, and animation classes
 */
export function useStaggeredScrollReveal<T extends HTMLElement = HTMLElement>(
  index: number,
  options: UseScrollRevealOptions = {}
): UseScrollRevealResult<T> {
  const baseDelay = options.delay || 0
  const staggerDelay = index * 100 // 100ms between each item

  return useScrollReveal<T>({
    ...options,
    delay: baseDelay + staggerDelay,
  })
}
