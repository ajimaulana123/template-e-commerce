import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// PUT - Update review
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { rating, review, images } = body

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if review exists and belongs to user
    const existingReview = await prisma.productReview.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (existingReview.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update review
    const updatedReview = await prisma.productReview.update({
      where: { id },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(review !== undefined && { review }),
        ...(images && { images })
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

    // Recalculate product rating
    const reviews = await prisma.productReview.findMany({
      where: { productId: existingReview.productId }
    })

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = totalRating / reviews.length

    await prisma.product.update({
      where: { id: existingReview.productId },
      data: {
        rating: averageRating,
        totalReviews: reviews.length
      }
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

// DELETE - Delete review
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

    // Check if review exists and belongs to user
    const existingReview = await prisma.productReview.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (existingReview.userId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete review
    await prisma.productReview.delete({
      where: { id }
    })

    // Recalculate product rating
    const reviews = await prisma.productReview.findMany({
      where: { productId: existingReview.productId }
    })

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    await prisma.product.update({
      where: { id: existingReview.productId },
      data: {
        rating: averageRating,
        totalReviews: reviews.length
      }
    })

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
