import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// GET personalized recommendations
export async function GET(request: Request) {
  try {
    const session = await verifySession()

    // If user is logged in, get personalized recommendations
    if (session) {
      return getPersonalizedRecommendations(session.userId)
    }

    // If guest, return popular/trending products
    return getGuestRecommendations()
  } catch (error) {
    console.error('Get recommendations error:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}

// Personalized recommendations for logged-in users
async function getPersonalizedRecommendations(userId: string) {
  try {
    // Get user's purchase history categories
    const purchaseHistory = await prisma.order.findMany({
      where: {
        userId,
        status: {
          in: ['DELIVERED', 'COMPLETED']
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                categoryId: true
              }
            }
          }
        }
      },
      take: 10
    })

    // Get user's wishlist categories
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            categoryId: true
          }
        }
      },
      take: 10
    })

    // Get user's cart categories
    const cart = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            categoryId: true
          }
        }
      }
    })

    // Collect all category IDs from user behavior
    const categoryIds = new Set<string>()

    // Add categories from purchase history
    purchaseHistory.forEach(order => {
      order.items.forEach(item => {
        categoryIds.add(item.product.categoryId)
      })
    })

    // Add categories from wishlist
    wishlist.forEach(item => {
      categoryIds.add(item.product.categoryId)
    })

    // Add categories from cart
    cart.forEach(item => {
      categoryIds.add(item.product.categoryId)
    })

    // If user has behavior data, recommend based on it
    if (categoryIds.size > 0) {
      const recommendations = await prisma.product.findMany({
        where: {
          categoryId: {
            in: Array.from(categoryIds)
          },
          stock: { gt: 0 }
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { rating: 'desc' },
          { sold: 'desc' }
        ],
        take: 12
      })

      return NextResponse.json({
        type: 'personalized',
        products: recommendations
      })
    }

    // If no behavior data, fallback to popular products
    return getGuestRecommendations()
  } catch (error) {
    console.error('Personalized recommendations error:', error)
    return getGuestRecommendations()
  }
}

// Guest recommendations (popular/trending)
async function getGuestRecommendations() {
  try {
    // Get trending products (high rating + high sales)
    const trendingProducts = await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        rating: { gte: 4 }, // Rating 4 or above
        sold: { gte: 10 }   // At least 10 sold
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { sold: 'desc' }
      ],
      take: 12
    })

    // If not enough trending products, get popular products
    if (trendingProducts.length < 12) {
      const popularProducts = await prisma.product.findMany({
        where: {
          stock: { gt: 0 }
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { sold: 'desc' },
          { rating: 'desc' }
        ],
        take: 12
      })

      return NextResponse.json({
        type: 'popular',
        products: popularProducts
      })
    }

    return NextResponse.json({
      type: 'trending',
      products: trendingProducts
    })
  } catch (error) {
    console.error('Guest recommendations error:', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}
