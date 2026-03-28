import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { deleteCache, cacheKeys } from '@/lib/cache'

// GET user orders
export async function GET() {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    logger.debug('Orders fetched', { userId: session.userId, count: orders.length })
    return NextResponse.json(orders)
  } catch (error) {
    logger.error('Failed to fetch orders', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST create order
export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      cartItems, 
      shippingAddress, 
      paymentMethod,
      subtotal,
      shippingCost,
      total,
      notes
    } = body

    // Validate required fields
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.address || !shippingAddress?.city) {
      return NextResponse.json({ error: 'Shipping address is incomplete' }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: session.userId,
          orderNumber,
          status: 'PENDING',
          paymentMethod: paymentMethod === 'cod' ? 'COD' : 'BANK_TRANSFER',
          paymentStatus: 'PENDING',
          subtotal,
          shippingCost,
          total,
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode || null,
          province: shippingAddress.province || null,
          notes: notes || null
        }
      })

      // Create order items and update product stock
      for (const item of cartItems) {
        // Check stock availability
        const product = await tx.product.findUnique({
          where: { id: item.product.id }
        })

        if (!product) {
          throw new Error(`Product ${item.product.name} not found`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }

        // Create order item
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.images[0] || '',
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity
          }
        })

        // Update product stock and sold count
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: { decrement: item.quantity },
            sold: { increment: item.quantity }
          }
        })
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId: session.userId }
      })

      return newOrder
    })

    logger.info('Order created successfully', { 
      orderId: order.id, 
      orderNumber: order.orderNumber,
      userId: session.userId,
      total: order.total
    })

    // Invalidate caches since order count and analytics changed
    deleteCache(cacheKeys.dashboardStats())
    deleteCache(cacheKeys.analytics())

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        orderNumber: order.orderNumber
      }
    })
  } catch (error) {
    logger.error('Failed to create order', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
