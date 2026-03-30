/**
 * Animation Utilities for Homepage UX Improvements
 * Provides reusable animation functions and configurations
 */

import { tokens, a11y } from '@/lib/design-tokens'

/**
 * Stagger delay calculator for sequential animations
 * @param index - Element index in sequence
 * @param baseDelay - Base delay in milliseconds
 * @returns Delay string for CSS
 */
export function getStaggerDelay(index: number, baseDelay: number = 100): string {
  return `${index * baseDelay}ms`
}

/**
 * Get animation classes based on user's motion preference
 * @param animationClasses - Animation classes to apply
 * @returns Classes with motion-safe prefix if animations enabled
 */
export function getMotionSafeClasses(animationClasses: string): string {
  if (typeof window !== 'undefined' && a11y.prefersReducedMotion()) {
    return ''
  }
  return animationClasses
}

/**
 * Scroll reveal animation configuration
 */
export const scrollRevealConfig = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
  triggerOnce: true,
}

/**
 * Animation variants for different effects
 */
export const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  
  slideInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  
  slideInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
}

/**
 * Transition configurations
 */
export const transitionConfig = {
  fast: {
    duration: 0.15,
    ease: 'easeOut',
  },
  
  base: {
    duration: 0.2,
    ease: 'easeOut',
  },
  
  slow: {
    duration: 0.3,
    ease: 'easeOut',
  },
  
  slower: {
    duration: 0.4,
    ease: 'easeOut',
  },
  
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
}

/**
 * CSS animation keyframes
 */
export const keyframes = {
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }
  `,
  
  slideUp: `
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  
  scaleIn: `
    @keyframes scaleIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
}

/**
 * Apply GPU-accelerated transform for better performance
 * @param element - HTML element
 */
export function enableGPUAcceleration(element: HTMLElement): void {
  element.style.transform = 'translateZ(0)'
  element.style.willChange = 'transform, opacity'
}

/**
 * Remove GPU acceleration hint after animation
 * @param element - HTML element
 */
export function disableGPUAcceleration(element: HTMLElement): void {
  element.style.willChange = 'auto'
}

/**
 * Create a staggered animation delay for multiple elements
 * @param elements - Array of HTML elements
 * @param baseDelay - Base delay in milliseconds
 * @param staggerAmount - Delay increment between elements in milliseconds
 */
export function applyStaggeredAnimation(
  elements: HTMLElement[],
  baseDelay: number = 0,
  staggerAmount: number = 100
): void {
  elements.forEach((element, index) => {
    const delay = baseDelay + (index * staggerAmount)
    element.style.animationDelay = `${delay}ms`
  })
}

/**
 * Check if animations should be enabled based on user preference
 * @returns true if animations should be enabled
 */
export function shouldEnableAnimations(): boolean {
  if (typeof window === 'undefined') return true
  return !a11y.prefersReducedMotion()
}

/**
 * Get CSS class for fade-in animation with optional direction
 * @param direction - Direction of fade-in (up, down, left, right, or none)
 * @returns CSS class string
 */
export function getFadeInClass(
  direction?: 'up' | 'down' | 'left' | 'right'
): string {
  if (!shouldEnableAnimations()) return ''
  
  switch (direction) {
    case 'up':
      return 'animate-fade-in-up'
    case 'down':
      return 'animate-fade-in-down'
    case 'left':
      return 'animate-fade-in-left'
    case 'right':
      return 'animate-fade-in-right'
    default:
      return 'animate-fade-in'
  }
}

/**
 * Get CSS class for scale animation
 * @returns CSS class string
 */
export function getScaleInClass(): string {
  if (!shouldEnableAnimations()) return ''
  return 'animate-scale-in'
}

/**
 * Get CSS class for slide animation
 * @param direction - Direction of slide (left or right)
 * @returns CSS class string
 */
export function getSlideInClass(direction: 'left' | 'right'): string {
  if (!shouldEnableAnimations()) return ''
  return direction === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
}

/**
 * Create intersection observer for scroll-triggered animations
 * @param callback - Callback function when element intersects
 * @param options - Intersection observer options
 * @returns IntersectionObserver instance
 */
export function createScrollObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') {
    return null
  }

  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    ...options,
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry)
      }
    })
  }, defaultOptions)
}

/**
 * Animate element on scroll into view
 * @param element - HTML element to animate
 * @param animationClass - CSS class to add when visible
 * @param options - Intersection observer options
 * @returns Cleanup function
 */
export function animateOnScroll(
  element: HTMLElement,
  animationClass: string,
  options: IntersectionObserverInit = {}
): () => void {
  if (!shouldEnableAnimations()) {
    element.classList.add(animationClass)
    return () => {}
  }

  const observer = createScrollObserver((entry) => {
    entry.target.classList.add(animationClass)
  }, options)

  if (!observer) {
    element.classList.add(animationClass)
    return () => {}
  }

  observer.observe(element)

  return () => {
    observer.disconnect()
  }
}
