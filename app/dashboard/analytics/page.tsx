import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import AnalyticsPageClient from './AnalyticsPageClient'

export default async function AnalyticsPage() {
  const session = await verifySession()
  
  if (!session || session.role !== 'ADMIN') {
    redirect('/')
  }

  return <AnalyticsPageClient />
}
