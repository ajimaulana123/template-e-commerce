/**
 * useIntersectionObserver Hook
 * Generic intersection observer hook for detecting when elements enter viewport
 * Requirements: 6.2
 */

import { useEffect, useRef, useState } from 'react'

export interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
  enabled?: boolean
}

export interface UseIntersectionObserverResult<T extends HTMLElement = HTMLElement> {
  isIntersecting: boolean
  entry: IntersectionObserverEntry | null
}

/**
 * Hook to observe when an element intersects with the viewport
 * @param options - Intersection observer configuration
 * @returns Object with isIntersecting state and entry details
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, UseIntersectionObserverResult<T>] {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    enabled = true,
  } = options

  const elementRef = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!enabled) return
    if (triggerOnce && hasTriggered.current) return

    const element = elementRef.current
    if (!element) return

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: assume element is visible
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [observerEntry] = entries
        setEntry(observerEntry)
        setIsIntersecting(observerEntry.isIntersecting)

        if (observerEntry.isIntersecting && triggerOnce) {
          hasTriggered.current = true
          observer.disconnect()
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, triggerOnce, enabled])

  return [elementRef, { isIntersecting, entry }]
}
