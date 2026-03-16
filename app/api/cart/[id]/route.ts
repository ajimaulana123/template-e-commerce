import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// PUT update cart item quantity
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
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    }

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        userId: session.userId
      },
      include: {
        product: true
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    // Check stock availability
    if (cartItem.product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: id },
      data: { quantity: quantity },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json(updatedCartItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

// DELETE remove cart item
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

    // Check if cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        userId: session.userId
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Cart item removed' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 })
  }
}