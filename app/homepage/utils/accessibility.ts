/**
 * Accessibility Utilities for Homepage UX Improvements
 * Provides helper functions for WCAG compliance and accessible interactions
 */

import { tokens, a11y } from '@/lib/design-tokens'

/**
 * Generate unique ID for accessibility attributes
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateA11yId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if element is keyboard focusable
 * @param element - HTML element to check
 * @returns True if element is focusable
 */
export function isKeyboardFocusable(element: HTMLElement): boolean {
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']
  const isFocusableTag = focusableTags.includes(element.tagName)
  const hasTabIndex = element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1'
  
  return isFocusableTag || hasTabIndex
}

/**
 * Get all focusable elements within a container
 * @param container - Container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')
  
  return Array.from(container.querySelectorAll(selector))
}

/**
 * Trap focus within a container (for modals, dialogs)
 * @param container - Container element
 * @param event - Keyboard event
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  if (event.key !== 'Tab') return
  
  const focusableElements = getFocusableElements(container)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement?.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement?.focus()
  }
}

/**
 * Announce message to screen readers
 * @param message - Message to announce
 * @param priority - Announcement priority (polite or assertive)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Check if touch target meets minimum size requirements
 * @param element - HTML element
 * @returns Object with validation result and dimensions
 */
export function validateTouchTarget(element: HTMLElement): {
  isValid: boolean
  width: number
  height: number
  minSize: number
} {
  const rect = element.getBoundingClientRect()
  const minSize = parseInt(tokens.touchTarget.minimum)
  
  return {
    isValid: rect.width >= minSize && rect.height >= minSize,
    width: rect.width,
    height: rect.height,
    minSize,
  }
}

/**
 * Check spacing between adjacent interactive elements
 * @param element1 - First element
 * @param element2 - Second element
 * @returns Object with validation result and spacing
 */
export function validateInteractiveSpacing(
  element1: HTMLElement,
  element2: HTMLElement
): {
  isValid: boolean
  spacing: number
  minSpacing: number
} {
  const rect1 = element1.getBoundingClientRect()
  const rect2 = element2.getBoundingClientRect()
  const minSpacing = parseInt(tokens.touchSpacing.minimum)
  
  // Calculate spacing (horizontal or vertical)
  let spacing: number
  
  if (rect1.right <= rect2.left) {
    // Horizontal spacing
    spacing = rect2.left - rect1.right
  } else if (rect1.bottom <= rect2.top) {
    // Vertical spacing
    spacing = rect2.top - rect1.bottom
  } else {
    // Overlapping or other arrangement
    spacing = 0
  }
  
  return {
    isValid: spacing >= minSpacing,
    spacing,
    minSpacing,
  }
}

/**
 * Add skip link to page
 * @param targetId - ID of main content element
 * @returns Skip link element
 */
export function createSkipLink(targetId: string): HTMLAnchorElement {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded'
  
  return skipLink
}

/**
 * Validate heading hierarchy
 * @param container - Container element to check
 * @returns Validation result with any issues found
 */
export function validateHeadingHierarchy(container: HTMLElement): {
  isValid: boolean
  issues: string[]
} {
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const issues: string[] = []
  let previousLevel = 0
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1))
    
    if (index === 0 && level !== 1) {
      issues.push('First heading should be h1')
    }
    
    if (level - previousLevel > 1) {
      issues.push(`Heading level skipped: ${heading.tagName} after h${previousLevel}`)
    }
    
    previousLevel = level
  })
  
  return {
    isValid: issues.length === 0,
    issues,
  }
}

/**
 * Ensure all images have alt text
 * @param container - Container element to check
 * @returns Validation result
 */
export function validateImageAltText(container: HTMLElement): {
  isValid: boolean
  imagesWithoutAlt: HTMLImageElement[]
} {
  const images = Array.from(container.querySelectorAll('img'))
  const imagesWithoutAlt = images.filter(img => !img.hasAttribute('alt'))
  
  return {
    isValid: imagesWithoutAlt.length === 0,
    imagesWithoutAlt,
  }
}

/**
 * Check if all interactive elements have accessible names
 * @param container - Container element to check
 * @returns Validation result
 */
export function validateAccessibleNames(container: HTMLElement): {
  isValid: boolean
  elementsWithoutNames: HTMLElement[]
} {
  const interactiveElements = getFocusableElements(container)
  const elementsWithoutNames = interactiveElements.filter(element => {
    const hasAriaLabel = element.hasAttribute('aria-label')
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby')
    const hasTextContent = element.textContent?.trim().length > 0
    const hasAlt = element.hasAttribute('alt')
    const hasTitle = element.hasAttribute('title')
    
    return !(hasAriaLabel || hasAriaLabelledBy || hasTextContent || hasAlt || hasTitle)
  })
  
  return {
    isValid: elementsWithoutNames.length === 0,
    elementsWithoutNames,
  }
}

/**
 * Screen reader only CSS class
 */
export const srOnlyClass = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0'

/**
 * Focus visible CSS class
 */
export const focusVisibleClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500'
