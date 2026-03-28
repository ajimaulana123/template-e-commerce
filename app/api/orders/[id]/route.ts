import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { deleteCache, cacheKeys } from '@/lib/cache'

// GET single order
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                category: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        user: {
          select: {
            email: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user owns this order or is admin
    if (order.userId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    logger.error('Failed to fetch order', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PUT update order status (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      logger.security('Unauthorized order update attempt', { 
        userId: session?.userId,
        role: session?.role 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, paymentStatus } = body

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      }
    })

    logger.info('Order updated', { 
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus
    })

    // Invalidate caches since order status changed
    deleteCache(cacheKeys.dashboardStats())
    deleteCache(cacheKeys.analytics())

    return NextResponse.json(order)
  } catch (error) {
    logger.error('Failed to update order', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE cancel order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user owns this order
    if (order.userId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only allow cancellation if order is still pending
    if (order.status !== 'PENDING') {
      return NextResponse.json({ 
        error: 'Cannot cancel order that is already being processed' 
      }, { status: 400 })
    }

    // Cancel order and restore stock
    await prisma.$transaction(async (tx) => {
      // Restore product stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity }
          }
        })
      }

      // Update order status
      await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' }
      })
    })

    logger.info('Order cancelled', { 
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: session.userId
    })

    // Invalidate caches since order was cancelled
    deleteCache(cacheKeys.dashboardStats())
    deleteCache(cacheKeys.analytics())

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to cancel order', error)
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 })
  }
}
