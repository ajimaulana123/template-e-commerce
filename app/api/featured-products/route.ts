import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Cache configuration
const CACHE_DURATION = 60 * 5 // 5 minutes in seconds
let cachedData: any = null
let cacheTimestamp: number = 0

export async function GET() {
  try {
    // Return cached data if still valid
    const now = Date.now()
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION * 1000) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
        }
      })
    }
    // Flash Sale - Produk dengan diskon terbesar
    const productsWithDiscount = await prisma.product.findMany({
      where: {
        originalPrice: { not: null },
      },
      include: {
        category: true
      }
    })

    // Filter and find product with biggest discount
    const flashSale = productsWithDiscount
      .filter(p => p.originalPrice && p.originalPrice > p.price)
      .sort((a, b) => {
        const discountA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100
        const discountB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100
        return discountB - discountA
      })[0] || null

    // Best Seller - Produk paling laku
    const bestSeller = await prisma.product.findFirst({
      where: {
        sold: { gt: 0 }
      },
      orderBy: {
        sold: 'desc'
      },
      include: {
        category: true
      }
    })

    // New Arrival - Produk terbaru
    const newArrival = await prisma.product.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    })

    // Calculate discount percentage for flash sale
    const calculateDiscount = (original: number, current: number) => {
      return Math.round(((original - current) / original) * 100)
    }

    const responseData = {
      flashSale: flashSale ? {
        id: flashSale.id,
        name: flashSale.name,
        price: flashSale.price,
        originalPrice: flashSale.originalPrice,
        discount: calculateDiscount(flashSale.originalPrice!, flashSale.price),
        image: flashSale.images?.[0] || '/placeholder.png',
        category: flashSale.category.name
      } : null,
      bestSeller: bestSeller ? {
        id: bestSeller.id,
        name: bestSeller.name,
        price: bestSeller.price,
        sold: bestSeller.sold,
        image: bestSeller.images?.[0] || '/placeholder.png',
        category: bestSeller.category.name
      } : null,
      newArrival: newArrival ? {
        id: newArrival.id,
        name: newArrival.name,
        price: newArrival.price,
        image: newArrival.images?.[0] || '/placeholder.png',
        category: newArrival.category.name,
        createdAt: newArrival.createdAt
      } : null
    }

    // Update cache
    cachedData = responseData
    cacheTimestamp = Date.now()

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
      }
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}
