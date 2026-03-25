import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

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

    logger.debug('Admin orders fetched', { count: orders.length, status, page })
    
    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + orders.length < totalCount
      }
    })
  } catch (error) {
    logger.error('Failed to fetch admin orders', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
