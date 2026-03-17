import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    
    logger.debug('Categories fetched successfully', { count: categories.length })
    return NextResponse.json(categories)
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
