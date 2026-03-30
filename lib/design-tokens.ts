/**
 * Design System Tokens
 * Centralized design values for consistent UI/UX
 */

export const tokens = {
  // Color System - Halal Mart Theme
  colors: {
    // Primary - Green (Halal theme)
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Main brand color
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Secondary - Blue (Actions)
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    
    // Neutral - Grays
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Typography Scale
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Spacing Scale (4px base)
  space: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
  },
  
  // Border Radius
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Animation Durations
  animation: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '400ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    delay: {
      none: '0ms',
      short: '100ms',
      medium: '200ms',
      long: '300ms',
    },
  },
  
  // Z-index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Touch Targets (Accessibility)
  touchTarget: {
    minimum: '44px',      // WCAG 2.1 AA minimum
    comfortable: '48px',  // Android Material Design
    large: '56px',        // Enhanced accessibility
  },
  
  // Spacing for Touch Elements
  touchSpacing: {
    minimum: '8px',       // Minimum spacing between interactive elements
    comfortable: '12px',  // Comfortable spacing
    generous: '16px',     // Generous spacing
  },
  
  // Focus Indicators (Accessibility)
  focus: {
    outlineWidth: '2px',
    outlineOffset: '2px',
    outlineColor: '#3b82f6',
    outlineStyle: 'solid',
  },
  
  // Contrast Ratios (WCAG)
  contrast: {
    aa: 4.5,      // WCAG AA for normal text
    aaLarge: 3,   // WCAG AA for large text
    aaa: 7,       // WCAG AAA for normal text
    aaaLarge: 4.5,// WCAG AAA for large text
  },
}

// Helper function to get color with opacity
export function withOpacity(color: string, opacity: number): string {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
}

// Helper to get responsive value
export function responsive(values: { sm?: string; md?: string; lg?: string; xl?: string }) {
  return Object.entries(values)
    .map(([breakpoint, value]) => `${breakpoint}:${value}`)
    .join(' ')
}

// Animation Utilities
export const animations = {
  // Fade in animation
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  
  // Fade in with slide up
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  
  // Scale in animation
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  
  // Lift effect (for hover)
  lift: {
    transform: 'translateY(-4px)',
    transition: 'transform 300ms ease-out, box-shadow 300ms ease-out',
  },
  
  // Pulse animation (for CTAs)
  pulse: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
}

// Accessibility Utilities
export const a11y = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Get accessible animation props (respects reduced motion)
  getAnimationProps: (animationKey: keyof typeof animations) => {
    if (a11y.prefersReducedMotion()) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 },
      }
    }
    return animations[animationKey]
  },
  
  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    // Simplified contrast calculation
    // In production, use a proper color contrast library
    const getLuminance = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16)
      const r = (rgb >> 16) & 0xff
      const g = (rgb >> 8) & 0xff
      const b = (rgb >> 0) & 0xff
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }
    
    const l1 = getLuminance(color1)
    const l2 = getLuminance(color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  },
  
  // Check if contrast meets WCAG standards
  meetsContrastRequirement: (
    color1: string,
    color2: string,
    level: 'aa' | 'aaa' = 'aa',
    isLargeText: boolean = false
  ): boolean => {
    const ratio = a11y.getContrastRatio(color1, color2)
    const requirement = isLargeText
      ? tokens.contrast[`${level}Large` as keyof typeof tokens.contrast]
      : tokens.contrast[level]
    return ratio >= requirement
  },
  
  // Generate aria-label for interactive elements
  generateAriaLabel: (element: string, context?: string): string => {
    return context ? `${element} - ${context}` : element
  },
  
  // Check if element meets minimum touch target size
  meetsTouchTargetSize: (width: number, height: number): boolean => {
    const minSize = parseInt(tokens.touchTarget.minimum)
    return width >= minSize && height >= minSize
  },
}

// CSS class utilities for common patterns
export const cssUtils = {
  // Touch target classes
  touchTarget: {
    minimum: `min-w-[${tokens.touchTarget.minimum}] min-h-[${tokens.touchTarget.minimum}]`,
    comfortable: `min-w-[${tokens.touchTarget.comfortable}] min-h-[${tokens.touchTarget.comfortable}]`,
    large: `min-w-[${tokens.touchTarget.large}] min-h-[${tokens.touchTarget.large}]`,
  },
  
  // Focus visible styles
  focusVisible: 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
  
  // Hover lift effect
  hoverLift: 'transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg',
  
  // Reduced motion safe animation
  animateSafe: 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4',
}
