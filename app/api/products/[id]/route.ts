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

    // Delete product images from storage if exists
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const imageFileName = getProductImageFileNameFromUrl(imageUrl)
        if (imageFileName) {
          console.log('Deleting product image:', imageFileName)
          const deleteResult = await deleteProductImage(imageFileName)
          if (!deleteResult.success) {
            console.warn('Failed to delete product image:', deleteResult.error)
            // Continue with product deletion even if image delete fails
          }
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
    const { name, description, price, originalPrice, images, categoryId, stock, badge } = body

    // Get current product
    const currentProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Ensure images is an array
    const newImageArray = Array.isArray(images) ? images : (images ? [images] : currentProduct.images)

    // Find images that were removed (exist in old but not in new)
    const oldImages = currentProduct.images || []
    const removedImages = oldImages.filter(oldImg => !newImageArray.includes(oldImg))

    // Delete removed images from Supabase storage
    if (removedImages.length > 0) {
      console.log(`Deleting ${removedImages.length} removed images...`)
      for (const imageUrl of removedImages) {
        const imageFileName = getProductImageFileNameFromUrl(imageUrl)
        if (imageFileName) {
          console.log('Deleting image:', imageFileName)
          const deleteResult = await deleteProductImage(imageFileName)
          if (!deleteResult.success) {
            console.warn('Failed to delete image:', deleteResult.error)
            // Continue even if delete fails
          }
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
        images: newImageArray,
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
