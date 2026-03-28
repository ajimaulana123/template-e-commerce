import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getCache, setCache, cacheKeys, cacheTTL } from '@/lib/cache'

// GET all orders (admin only) with pagination
export async function GET(request: Request) {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      logger.security('Unauthorized admin orders access attempt', { 
        userId: session?.userId,
        role: session?.role 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build cache key
    const cacheKey = `orders:admin:${page}:${limit}${status ? `:${status}` : ''}`
    
    // Check cache first
    const cachedData = getCache(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': `public, s-maxage=${cacheTTL.products}, stale-while-revalidate=${cacheTTL.products * 2}`,
          'X-Cache': 'HIT'
        }
      })
    }

    const where = status ? { status: status as any } : {}

    // Get total count
    const totalCount = await prisma.order.count({ where })

    // Get paginated orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const responseData = {
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + orders.length < totalCount
      },
      lastUpdated: new Date().toISOString()
    }

    // Cache the result
    setCache(cacheKey, responseData, cacheTTL.products)

    logger.debug('Admin orders fetched', { count: orders.length, status, page })
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, s-maxage=${cacheTTL.products}, stale-while-revalidate=${cacheTTL.products * 2}`,
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    logger.error('Failed to fetch admin orders', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
