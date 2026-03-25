'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { loginAction } from '@/app/actions/auth-actions'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if already logged in
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          // Redirect to return URL or home
          router.push(returnUrl || '/')
        } else {
          setChecking(false)
        }
      })
      .catch(() => setChecking(false))
  }, [router, returnUrl])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(null, formData)

    if (result.success && result.role) {
      // Redirect to return URL or home
      router.push(returnUrl || '/')
      router.refresh()
    } else if (result.message) {
      setError(result.message)
    }
    
    setLoading(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4 animate-pulse">
            <i className="fas fa-spinner fa-spin text-white text-2xl" />
          </div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <i className="fas fa-store text-white text-2xl" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Halal Mart
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            Selamat datang kembali! Silakan login ke akun Anda
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-center gap-2">
                <i className="fas fa-exclamation-circle" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-envelope text-green-600" />
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
                className="h-11 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-lock text-green-600" />
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password Anda"
                required
                className="h-11 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2" />
                  Login
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">atau</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link 
                  href={`/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
                  className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <i className="fas fa-store text-white text-2xl" />
          </div>
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-11 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-11 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-11 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
