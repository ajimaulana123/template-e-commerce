import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

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
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST create category
export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, icon, slug } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check for duplicate name
    const duplicateName = await prisma.category.findFirst({
      where: { name }
    })

    if (duplicateName) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Check for duplicate slug
    const duplicateSlug = await prisma.category.findFirst({
      where: { slug }
    })

    if (duplicateSlug) {
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

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('POST category error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
