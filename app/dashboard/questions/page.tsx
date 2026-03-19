import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import QuestionsPageClient from './QuestionsPageClient'

export default async function QuestionsPage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'ADMIN') {
    redirect('/')
  }

  return <QuestionsPageClient />
}
