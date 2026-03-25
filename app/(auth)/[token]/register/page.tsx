'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { registerAction } from '@/app/actions/auth-actions'

export default function SecretRegisterPage() {
  const router = useRouter()
  const params = useParams()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [validToken, setValidToken] = useState(false)

  useEffect(() => {
    // Verify token
    const token = params.token as string
    fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setValidToken(true)
          setChecking(false)
        } else {
          router.push('/login')
        }
      })
      .catch(() => router.push('/login'))
  }, [params.token, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('token', params.token as string)
    
    const result = await registerAction(null, formData)

    if (result.success && result.message) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push('/login')
      }, 1500)
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
          <p className="text-gray-600 font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    )
  }

  if (!validToken) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <i className="fas fa-user-shield text-white text-2xl" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Halal Mart
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            Buat akun baru dengan akses khusus
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
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg flex items-center gap-2">
                <i className="fas fa-check-circle" />
                <span>{success}</span>
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
                placeholder="admin@example.com"
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
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                className="h-11 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <i className="fas fa-user-tag text-green-600" />
                Role
              </label>
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  defaultChecked
                  disabled
                  className="w-4 h-4 text-green-600"
                />
                <span className="font-semibold text-green-700">Admin</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Membuat Akun...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2" />
                  Daftar
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
                Sudah punya akun?{' '}
                <Link 
                  href="/login"
                  className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                >
                  Login sekarang
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
