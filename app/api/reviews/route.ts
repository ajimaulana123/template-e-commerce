import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// POST - Create review
export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, orderId, rating, review, images } = body

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.userId,
        status: {
          in: ['DELIVERED', 'COMPLETED']
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

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found or not eligible for review' 
      }, { status: 404 })
    }

    // Check if user bought this product in this order
    if (order.items.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found in this order' 
      }, { status: 400 })
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
        error: 'You have already reviewed this product' 
      }, { status: 400 })
    }

    // Create review
    const newReview = await prisma.productReview.create({
      data: {
        userId: session.userId,
        productId,
        orderId,
        rating: parseInt(rating),
        review: review || null,
        images: images || []
      },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                fotoProfil: true
              }
            }
          }
        }
      }
    })

    // Update product rating
    const reviews = await prisma.productReview.findMany({
      where: { productId }
    })

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / reviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        totalReviews: reviews.length
      }
    })

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}

// GET - Get reviews for a product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const reviews = await prisma.productReview.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fotoProfil: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Map to include userId at top level for easier access
    const reviewsWithUserId = reviews.map(review => ({
      ...review,
      userId: review.user.id
    }))

    return NextResponse.json(reviewsWithUserId)
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
