import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// POST - Create question
export async function POST(request: Request) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, question } = body

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    if (question.length > 500) {
      return NextResponse.json({ error: 'Question is too long (max 500 characters)' }, { status: 400 })
    }

    // Create question
    const newQuestion = await prisma.productQuestion.create({
      data: {
        productId,
        userId: session.userId,
        question: question.trim()
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    return NextResponse.json(newQuestion, { status: 201 })
  } catch (error) {
    console.error('Create question error:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}

// GET - Get questions for a product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const filter = searchParams.get('filter') // 'all' | 'unanswered'

    const where: any = {}
    
    // If productId is provided, filter by product
    if (productId) {
      where.productId = productId
    }
    
    if (filter === 'unanswered') {
      where.answer = null
    }

    const questions = await prisma.productQuestion.findMany({
      where,
      include: {
        user: {
          select: {
            email: true
          }
        },
        product: {
          select: {
            name: true,
            images: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Get questions error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
