import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// GET single category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('GET category error:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// PUT update category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, icon, slug } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check for duplicate name (excluding current category)
    const duplicateName = await prisma.category.findFirst({
      where: {
        name: name,
        id: { not: id }
      }
    })

    if (duplicateName) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Check for duplicate slug (excluding current category)
    const duplicateSlug = await prisma.category.findFirst({
      where: {
        slug: slug,
        id: { not: id }
      }
    })

    if (duplicateSlug) {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 400 })
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, icon, slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('PUT category error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. It has ${existingCategory._count.products} products. Please move or delete the products first.` 
      }, { status: 400 })
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('DELETE category error:', error)
    
    // Handle foreign key constraint errors
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      return NextResponse.json({ 
        error: 'Cannot delete category because it has associated products' 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}