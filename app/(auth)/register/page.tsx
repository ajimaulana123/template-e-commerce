'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push(`/login${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router, returnUrl])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Registration Disabled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Halaman registrasi publik tidak tersedia.
          </p>
          <p className="text-sm text-gray-500">
            Untuk membuat akun baru, hubungi administrator.
          </p>
          <p className="text-xs text-gray-400">
            Redirecting to login...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function RegisterFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Registration Disabled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Halaman registrasi publik tidak tersedia.
          </p>
          <p className="text-sm text-gray-500">
            Untuk membuat akun baru, hubungi administrator.
          </p>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterContent />
    </Suspense>
  )
}
