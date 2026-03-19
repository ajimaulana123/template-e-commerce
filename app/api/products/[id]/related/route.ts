import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET related products
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current product
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        categoryId: true,
        price: true
      }
    })

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Calculate price range (±30%)
    const minPrice = currentProduct.price * 0.7
    const maxPrice = currentProduct.price * 1.3

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: id } }, // Exclude current product
          { categoryId: currentProduct.categoryId }, // Same category
          { 
            price: {
              gte: Math.floor(minPrice),
              lte: Math.ceil(maxPrice)
            }
          }, // Similar price range
          { stock: { gt: 0 } } // In stock
        ]
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
        { rating: 'desc' }, // Best rating first
        { sold: 'desc' },   // Most sold second
        { createdAt: 'desc' } // Newest third
      ],
      take: 8 // Limit to 8 products
    })

    return NextResponse.json(relatedProducts)
  } catch (error) {
    console.error('Get related products error:', error)
    return NextResponse.json({ error: 'Failed to fetch related products' }, { status: 500 })
  }
}
