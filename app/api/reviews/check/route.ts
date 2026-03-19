import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// GET - Check if user can review a product
export async function GET(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.productReview.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId: productId
        }
      }
    })

    if (existingReview) {
      return NextResponse.json({ 
        canReview: false, 
        hasReviewed: true,
        review: existingReview,
        userId: session.userId
      })
    }

    // Check if user has completed order with this product
    const completedOrder = await prisma.order.findFirst({
      where: {
        userId: session.userId,
        status: {
          in: ['DELIVERED', 'COMPLETED']
        },
        items: {
          some: {
            productId: productId
          }
        }
      },
      include: {
        items: {
          where: {
            productId: productId
          }
        }
      }
    })

    if (!completedOrder) {
      return NextResponse.json({ 
        canReview: false, 
        hasReviewed: false,
        message: 'You need to purchase and receive this product first',
        userId: session.userId
      })
    }

    return NextResponse.json({ 
      canReview: true, 
      hasReviewed: false,
      orderId: completedOrder.id,
      userId: session.userId
    })
  } catch (error) {
    console.error('Check review eligibility error:', error)
    return NextResponse.json({ error: 'Failed to check review eligibility' }, { status: 500 })
  }
}
