import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getCache, setCache, deleteCache, cacheKeys, cacheTTL } from '@/lib/cache'

// GET all categories
export async function GET() {
  try {
    // Check cache first
    const cacheKey = cacheKeys.categories()
    const cached = getCache(cacheKey)
    
    if (cached) {
      logger.debug('Categories served from cache')
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
        }
      })
    }

    // Fetch from database
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    
    // Store in cache
    setCache(cacheKey, categories, cacheTTL.categories)
    
    logger.debug('Categories fetched from database', { count: categories.length })
    return NextResponse.json(categories, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    })
  } catch (error) {
    logger.error('Failed to fetch categories', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST create category
export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      logger.security('Unauthorized category creation attempt', { 
        userId: session?.userId,
        role: session?.role 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, icon, slug } = body

    // Validate required fields
    if (!name || !slug) {
      logger.warn('Category creation failed - missing required fields')
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check for duplicate name
    const duplicateName = await prisma.category.findFirst({
      where: { name }
    })

    if (duplicateName) {
      logger.warn('Category creation failed - duplicate name', { name })
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Check for duplicate slug
    const duplicateSlug = await prisma.category.findFirst({
      where: { slug }
    })

    if (duplicateSlug) {
      logger.warn('Category creation failed - duplicate slug', { slug })
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name, icon, slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    // Invalidate categories cache
    const cacheKey = cacheKeys.categories()
    deleteCache(cacheKey)

    logger.info('Category created successfully', { 
      categoryId: category.id, 
      categoryName: category.name,
      userId: session.userId 
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    logger.error('Category creation failed', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
