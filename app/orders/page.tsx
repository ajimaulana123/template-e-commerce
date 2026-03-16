import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import OrdersPageClient from './OrdersPageClient'

export default async function OrdersPage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login?returnUrl=/orders')
  }

  return <OrdersPageClient />
}