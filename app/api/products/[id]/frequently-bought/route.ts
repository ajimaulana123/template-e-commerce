import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET frequently bought together products
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get orders that contain this product
    const ordersWithProduct = await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId: id
          }
        },
        status: {
          in: ['DELIVERED', 'COMPLETED']
        }
      },
      include: {
        items: {
          where: {
            productId: {
              not: id // Exclude current product
            }
          },
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      take: 50 // Analyze last 50 orders
    })

    // Count frequency of each product
    const productFrequency = new Map<string, { product: any; count: number }>()

    ordersWithProduct.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id
        if (productFrequency.has(productId)) {
          const existing = productFrequency.get(productId)!
          existing.count++
        } else {
          productFrequency.set(productId, {
            product: item.product,
            count: 1
          })
        }
      })
    })

    // Sort by frequency and get top products
    const frequentlyBought = Array.from(productFrequency.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map(item => item.product)
      .filter(product => product.stock > 0) // Only in-stock products

    return NextResponse.json(frequentlyBought)
  } catch (error) {
    console.error('Get frequently bought together error:', error)
    return NextResponse.json({ error: 'Failed to fetch frequently bought products' }, { status: 500 })
  }
}
