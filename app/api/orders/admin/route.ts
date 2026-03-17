import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET all orders (admin only)
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

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : {},
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
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    logger.debug('Admin orders fetched', { count: orders.length, status })
    return NextResponse.json(orders)
  } catch (error) {
    logger.error('Failed to fetch admin orders', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
