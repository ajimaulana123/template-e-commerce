import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import ProfilePageClient from './ProfilePageClient'

export default async function ProfilePage() {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login?returnUrl=/profile')
  }

  return <ProfilePageClient />
}