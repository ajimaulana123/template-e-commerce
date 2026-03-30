'use client'

import React from 'react'
import { Eye, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UrgencyIndicatorProps {
  /**
   * Stock level - displays "Only X left" when below threshold
   */
  stockRemaining?: number
  
  /**
   * View count - displays popularity indicator
   */
  viewCount?: number
  
  /**
   * Stock threshold - below this number, stock indicator shows
   * @default 10
   */
  stockThreshold?: number
  
  /**
   * View threshold - above this number, view counter shows
   * @default 50
   */
  viewThreshold?: number
  
  /**
   * Display variant
   * @default 'compact'
   */
  variant?: 'compact' | 'detailed'
  
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * UrgencyIndicator Component
 * 
 * Displays urgency signals to encourage purchase decisions:
 * - Stock level indicators ("Only X left") for low stock items
 * - View counters showing product popularity
 * - Conditional rendering based on configurable thresholds
 * 
 * Validates: Requirements 5.3, 10.4
 * 
 * @example
 * ```tsx
 * // Show stock urgency for low stock items
 * <UrgencyIndicator stockRemaining={3} />
 * 
 * // Show popularity for high-view items
 * <UrgencyIndicator viewCount={150} />
 * 
 * // Show both indicators
 * <UrgencyIndicator stockRemaining={5} viewCount={200} />
 * ```
 */
export default function UrgencyIndicator({
  stockRemaining,
  viewCount,
  stockThreshold = 10,
  viewThreshold = 50,
  variant = 'compact',
  className
}: UrgencyIndicatorProps) {
  // Determine which indicators to show based on thresholds
  const showStockIndicator = 
    stockRemaining !== undefined && 
    stockRemaining > 0 && 
    stockRemaining <= stockThreshold

  const showViewCounter = 
    viewCount !== undefined && 
    viewCount >= viewThreshold

  // Don't render if no indicators should be shown
  if (!showStockIndicator && !showViewCounter) {
    return null
  }

  return (
    <div 
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Stock Level Indicator */}
      {showStockIndicator && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md font-semibold",
            "bg-orange-100 text-orange-800 border border-orange-200",
            variant === 'compact' ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
          )}
          aria-label={`Only ${stockRemaining} items left in stock`}
        >
          <Package 
            className={cn(
              "flex-shrink-0",
              variant === 'compact' ? "h-3 w-3" : "h-4 w-4"
            )} 
            aria-hidden="true"
          />
          <span>
            Only {stockRemaining} left!
          </span>
        </div>
      )}

      {/* View Counter - Popularity Indicator */}
      {showViewCounter && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md font-medium",
            "bg-blue-100 text-blue-800 border border-blue-200",
            variant === 'compact' ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
          )}
          aria-label={`${viewCount} people viewing this product`}
        >
          <Eye 
            className={cn(
              "flex-shrink-0",
              variant === 'compact' ? "h-3 w-3" : "h-4 w-4"
            )} 
            aria-hidden="true"
          />
          <span>
            {formatViewCount(viewCount)} viewing
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Format view count for display
 * - Shows exact count for < 1000
 * - Shows "1K+" for >= 1000
 */
function formatViewCount(count: number): string {
  if (count < 1000) {
    return count.toString()
  }
  
  const thousands = Math.floor(count / 1000)
  return `${thousands}K+`
}
