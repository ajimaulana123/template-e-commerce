import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import CheckoutPageClient from './CheckoutPageClient'

export default async function CheckoutPage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login?returnUrl=/checkout')
  }

  return <CheckoutPageClient />
}