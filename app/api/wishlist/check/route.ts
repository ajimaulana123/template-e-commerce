import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// GET - Check if product is in wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    
    // If not logged in, return false (not in wishlist)
    if (!session || !session.userId) {
      return NextResponse.json({ 
        inWishlist: false,
        wishlistItemId: null 
      })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId
        }
      }
    })

    return NextResponse.json({ 
      inWishlist: !!wishlistItem,
      wishlistItemId: wishlistItem?.id 
    })
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return NextResponse.json({ 
      inWishlist: false,
      wishlistItemId: null 
    }, { status: 200 })
  }
}
