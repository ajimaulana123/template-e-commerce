import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import OrderConfirmationClient from './OrderConfirmationClient'

export default async function OrderConfirmationPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  return <OrderConfirmationClient orderId={id} />
}
