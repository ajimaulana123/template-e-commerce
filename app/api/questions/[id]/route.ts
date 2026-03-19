import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// PUT - Answer question (Admin only)
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
    const { answer } = body

    if (!answer || answer.trim().length === 0) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 })
    }

    if (answer.length > 1000) {
      return NextResponse.json({ error: 'Answer is too long (max 1000 characters)' }, { status: 400 })
    }

    // Update question with answer
    const updatedQuestion = await prisma.productQuestion.update({
      where: { id },
      data: {
        answer: answer.trim(),
        answeredBy: session.userId,
        answeredAt: new Date()
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error('Answer question error:', error)
    return NextResponse.json({ error: 'Failed to answer question' }, { status: 500 })
  }
}

// DELETE - Delete question
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if question exists
    const question = await prisma.productQuestion.findUnique({
      where: { id }
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Only question owner or admin can delete
    if (question.userId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete question
    await prisma.productQuestion.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error('Delete question error:', error)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
