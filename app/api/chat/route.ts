import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await request.json()

    // Ensure system message is properly formatted
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    const completion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2048,
      stream: false,
    })

    return NextResponse.json({
      message: completion.choices[0]?.message?.content || 'No response',
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}
