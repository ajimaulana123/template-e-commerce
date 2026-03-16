import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { deleteProductImage, getProductImageFileNameFromUrl } from '@/lib/supabase'

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// DELETE product
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

    // Get product to delete its image from storage
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete product image from storage if exists
    if (product.image) {
      const imageFileName = getProductImageFileNameFromUrl(product.image)
      if (imageFileName) {
        console.log('Deleting product image:', imageFileName)
        const deleteResult = await deleteProductImage(imageFileName)
        if (!deleteResult.success) {
          console.warn('Failed to delete product image:', deleteResult.error)
          // Continue with product deletion even if image delete fails
        }
      }
    }

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

// PUT update product
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
    const { name, description, price, originalPrice, image, categoryId, stock, badge } = body

    // Get current product to check if image is being changed
    const currentProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // If image is being updated and there's an old image, delete it from storage
    if (image && currentProduct.image && currentProduct.image !== image) {
      const oldImageFileName = getProductImageFileNameFromUrl(currentProduct.image)
      if (oldImageFileName) {
        console.log('Deleting old product image:', oldImageFileName)
        const deleteResult = await deleteProductImage(oldImageFileName)
        if (!deleteResult.success) {
          console.warn('Failed to delete old product image:', deleteResult.error)
          // Continue with update even if delete fails
        }
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseInt(price),
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        image,
        categoryId,
        stock: parseInt(stock),
        badge
      },
      include: { category: true }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
