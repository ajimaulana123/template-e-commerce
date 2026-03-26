/**
 * Simple In-Memory Cache
 * 
 * Features:
 * - TTL (Time To Live) support
 * - Automatic expiration
 * - Type-safe
 * - No external dependencies
 */

interface CacheItem<T> {
  data: T
  expires: number
}

class SimpleCache {
  private cache: Map<string, CacheItem<any>>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.cache = new Map()
    this.startCleanup()
  }

  /**
   * Set cache with TTL (in seconds)
   */
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl * 1000
    })
  }

  /**
   * Get cached data (returns null if expired or not found)
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if expired
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  /**
   * Check if key exists and not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Delete keys matching pattern
   */
  deletePattern(pattern: string): number {
    let deleted = 0
    const regex = new RegExp(pattern)
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        deleted++
      }
    }
    
    return deleted
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Start automatic cleanup of expired items
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Cleanup expired items
   */
  private cleanup(): void {
    const now = Date.now()
    let cleaned = 0

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired items`)
    }
  }

  /**
   * Stop cleanup interval (for testing)
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }
}

// Export singleton instance
export const cache = new SimpleCache()

// Export helper functions
export const setCache = <T>(key: string, data: T, ttl: number) => cache.set(key, data, ttl)
export const getCache = <T>(key: string) => cache.get<T>(key)
export const hasCache = (key: string) => cache.has(key)
export const deleteCache = (key: string) => cache.delete(key)
export const clearCache = () => cache.clear()
export const deleteCachePattern = (pattern: string) => cache.deletePattern(pattern)

// Cache key generators
export const cacheKeys = {
  categories: () => 'categories:all',
  featuredProducts: () => 'products:featured',
  product: (id: string) => `product:${id}`,
  products: (page: number, limit: number) => `products:list:${page}:${limit}`,
  reviews: (productId: string) => `reviews:${productId}`,
  questions: (productId: string) => `questions:${productId}`,
  analytics: () => 'analytics:data',
}

// Cache TTL constants (in seconds)
export const cacheTTL = {
  categories: 3600,      // 1 hour (rarely changes)
  featuredProducts: 300, // 5 minutes
  product: 600,          // 10 minutes
  products: 300,         // 5 minutes
  reviews: 300,          // 5 minutes
  questions: 300,        // 5 minutes
  analytics: 300,        // 5 minutes
  profile: 600,          // 10 minutes
}

// Helper function to get cached profile
export async function getCachedProfile(userId: string): Promise<any> {
  const cacheKey = `profile:${userId}`
  let profile = getCache(cacheKey)
  
  if (!profile) {
    // Import prisma dynamically to avoid circular dependencies
    const { default: prisma } = await import('@/lib/prisma')
    
    profile = await prisma.profile.findUnique({
      where: { userId }
    })
    
    if (profile) {
      setCache(cacheKey, profile, cacheTTL.profile)
    }
  }
  
  return profile
}
