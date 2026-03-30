'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  endTime: Date
  onExpire?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * CountdownTimer Component
 * 
 * Displays a countdown timer showing days, hours, minutes, and seconds.
 * Updates every second and handles expiration callback.
 * Accessible with aria-live for screen readers.
 * 
 * Validates: Requirements 5.2
 * Property 13: Countdown Timer Display
 */
export default function CountdownTimer({
  endTime,
  onExpire,
  size = 'md',
  className
}: CountdownTimerProps) {
  const initialTime = calculateTimeRemaining(endTime)
  const initiallyExpired = 
    initialTime.days === 0 &&
    initialTime.hours === 0 &&
    initialTime.minutes === 0 &&
    initialTime.seconds === 0

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(initialTime)
  const [isExpired, setIsExpired] = useState(initiallyExpired)

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(endTime)
      setTimeRemaining(remaining)

      // Check if expired
      if (
        remaining.days === 0 &&
        remaining.hours === 0 &&
        remaining.minutes === 0 &&
        remaining.seconds === 0
      ) {
        setIsExpired(true)
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime, onExpire])

  if (isExpired) {
    return (
      <div
        className={cn('text-center', className)}
        role="status"
        aria-live="polite"
      >
        <span className="text-red-600 font-bold">Sale Berakhir!</span>
      </div>
    )
  }

  const sizeClasses = {
    sm: {
      container: 'gap-2',
      timeUnit: 'min-w-[40px] p-2',
      number: 'text-lg',
      label: 'text-xs'
    },
    md: {
      container: 'gap-3',
      timeUnit: 'min-w-[56px] p-3',
      number: 'text-2xl',
      label: 'text-sm'
    },
    lg: {
      container: 'gap-4',
      timeUnit: 'min-w-[72px] p-4',
      number: 'text-3xl',
      label: 'text-base'
    }
  }

  const styles = sizeClasses[size]

  return (
    <div
      className={cn('flex items-center justify-center', styles.container, className)}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Time remaining: ${formatAriaLabel(timeRemaining)}`}
    >
      {/* Days - only show if > 0 */}
      {timeRemaining.days > 0 && (
        <>
          <TimeUnit
            value={timeRemaining.days}
            label="Hari"
            size={size}
            styles={styles}
          />
          <Separator size={size} />
        </>
      )}

      {/* Hours */}
      <TimeUnit
        value={timeRemaining.hours}
        label="Jam"
        size={size}
        styles={styles}
      />
      <Separator size={size} />

      {/* Minutes */}
      <TimeUnit
        value={timeRemaining.minutes}
        label="Menit"
        size={size}
        styles={styles}
      />
      <Separator size={size} />

      {/* Seconds */}
      <TimeUnit
        value={timeRemaining.seconds}
        label="Detik"
        size={size}
        styles={styles}
      />
    </div>
  )
}

/**
 * TimeUnit Component
 * Displays a single time unit (days, hours, minutes, or seconds)
 */
function TimeUnit({
  value,
  label,
  size,
  styles
}: {
  value: number
  label: string
  size: 'sm' | 'md' | 'lg'
  styles: any
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-lg font-bold flex items-center justify-center',
          styles.timeUnit
        )}
      >
        <span className={styles.number}>{padZero(value)}</span>
      </div>
      <span className={cn('text-gray-600 font-medium mt-1', styles.label)}>
        {label}
      </span>
    </div>
  )
}

/**
 * Separator Component
 * Displays a colon separator between time units
 */
function Separator({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <span className={cn('text-gray-400 font-bold', sizeClasses[size])} aria-hidden="true">
      :
    </span>
  )
}

/**
 * Calculate time remaining until end time
 */
function calculateTimeRemaining(endTime: Date): TimeRemaining {
  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const difference = end - now

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

/**
 * Pad single digit numbers with leading zero
 */
function padZero(num: number): string {
  return num.toString().padStart(2, '0')
}

/**
 * Format time remaining for screen reader announcement
 */
function formatAriaLabel(time: TimeRemaining): string {
  const parts: string[] = []

  if (time.days > 0) {
    parts.push(`${time.days} hari`)
  }
  parts.push(`${time.hours} jam`)
  parts.push(`${time.minutes} menit`)
  parts.push(`${time.seconds} detik`)

  return parts.join(', ')
}
