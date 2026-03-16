import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await verifySession()
  
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      user: null
    })
  }

  try {
    // Get user with profile data
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true
      }
    })

    return NextResponse.json({
      authenticated: true,
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile
      } : null
    })
  } catch (error) {
    return NextResponse.json({
      authenticated: !!session,
      user: session ? {
        id: session.userId,
        email: session.email,
        role: session.role
      } : null
    })
  }
}
