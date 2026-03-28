import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { getCache, setCache, deleteCachePattern, cacheKeys, cacheTTL, deleteCache } from '@/lib/cache'

// GET all products with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build cache key based on parameters
    const cacheKey = cacheKeys.products(page, limit) + 
      (categoryId ? `:cat:${categoryId}` : '') + 
      (search ? `:search:${search}` : '')

    // Check cache first
    const cachedData = getCache(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': `public, s-maxage=${cacheTTL.products}, stale-while-revalidate=${cacheTTL.products * 2}`,
          'X-Cache': 'HIT'
        }
      })
    }

    // Build where clause
    const where: any = {}
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where })

    // Get paginated products
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const responseData = {
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + products.length < totalCount
      },
      lastUpdated: new Date().toISOString()
    }

    // Cache the result
    setCache(cacheKey, responseData, cacheTTL.products)

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, s-maxage=${cacheTTL.products}, stale-while-revalidate=${cacheTTL.products * 2}`,
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, originalPrice, images, categoryId, stock, badge } = body

    // Ensure images is an array
    const imageArray = Array.isArray(images) ? images : (images ? [images] : [])

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        images: imageArray,
        categoryId,
        stock: parseInt(stock) || 0,
        badge
      },
      include: { category: true }
    })

    // Invalidate product caches
    deleteCachePattern('products:.*')
    deleteCachePattern('product:.*')
    
    // Invalidate dashboard stats and analytics cache since product count changed
    deleteCache(cacheKeys.dashboardStats())
    deleteCache(cacheKeys.analytics())

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
