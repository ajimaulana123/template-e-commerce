import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { getCache, setCache, cacheKeys, cacheTTL } from '@/lib/cache'

export async function GET() {
  try {
    const session = await verifySession()
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check cache first
    const cacheKey = cacheKeys.dashboardStats()
    let stats = getCache(cacheKey)
    
    if (stats) {
      return NextResponse.json(stats, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT'
        }
      })
    }

    // If not in cache, fetch from database
    const [totalOrders, totalProducts, totalUsers, pendingOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(), 
      prisma.user.count(),
      prisma.order.count({ where: { status: 'PENDING' } })
    ])

    const quickStats = {
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      lastUpdated: new Date().toISOString()
    }

    // Cache the result for 5 minutes
    setCache(cacheKey, quickStats, cacheTTL.dashboardStats)

    return NextResponse.json(quickStats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

// POST - Clear cache (for when data changes)
export async function POST() {
  try {
    const session = await verifySession()
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear dashboard stats cache
    const cacheKey = cacheKeys.dashboardStats()
    const { deleteCache } = await import('@/lib/cache')
    deleteCache(cacheKey)

    return NextResponse.json({ success: true, message: 'Cache cleared' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}