import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import OrdersPageClient from './OrdersPageClient'

export default async function OrdersPage() {
  const session = await verifySession()
  
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  return <OrdersPageClient />
}
