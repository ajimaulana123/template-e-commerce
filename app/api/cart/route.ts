import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import { PrismaClient } from '@prisma/client'

// Create fresh Prisma instance to ensure latest schema
const prisma = new PrismaClient()

// Debug: Check if cartItem model exists
console.log('Available Prisma models:', Object.keys(prisma))

// GET user cart
export async function GET() {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if cartItem model is available
    if (!prisma.cartItem) {
      console.error('CartItem model not available in Prisma client')
      return NextResponse.json({ error: 'Cart service unavailable' }, { status: 503 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

// POST add to cart
export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Check if item already exists in cart
    let existingCartItem
    try {
      existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: session.userId,
            productId: productId
          }
        }
      })
    } catch (error) {
      console.error('Error finding existing cart item:', error)
      console.error('Prisma cartItem model available:', !!prisma.cartItem)
      return NextResponse.json({ error: 'Database error - cart model not available' }, { status: 500 })
    }

    let cartItem

    if (existingCartItem) {
      // Update quantity if item exists
      const newQuantity = existingCartItem.quantity + quantity
      
      if (product.stock < newQuantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.userId,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
    }

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}