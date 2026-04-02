'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        focusThrottleInterval: 10000,
        // Keep data fresh for 5 minutes
        refreshInterval: 300000,
        // Cache for 1 hour
        provider: () => new Map(),
        onError: (error) => {
          console.error('SWR Error:', error)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
