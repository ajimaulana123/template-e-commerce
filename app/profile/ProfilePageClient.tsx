'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, User, Mail, Shield, Calendar, Camera } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  role: string
  createdAt: string
  profile?: {
    id: string
    fotoProfil: string | null
  }
}

export default function ProfilePageClient() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/check')
      const data = await response.json()
      
      if (data.authenticated && data.user) {
        setUser(data.user)
      }
    } catch (error) {
      // Silent fail - failed to fetch profile
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5" />
              <h3 className="font-semibold">Profile Picture</h3>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {user.profile?.fotoProfil ? (
                  <img
                    src={user.profile.fotoProfil}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <Button variant="outline" size="sm" disabled>
                Change Photo
                <span className="text-xs text-gray-500 block">Coming Soon</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5" />
              <h3 className="font-semibold">Account Information</h3>
            </div>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact administrator if needed.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Account Type</span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member Since</span>
                </label>
                <Input
                  value={formatDate(user.createdAt)}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                {user.role === 'ADMIN' && (
                  <Link href="/dashboard">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                )}
                
                <Link href="/orders">
                  <Button variant="outline">
                    View My Orders
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/cart">
              <Button variant="outline" className="w-full justify-start">
                <span>View Cart</span>
              </Button>
            </Link>
            
            <Link href="/products">
              <Button variant="outline" className="w-full justify-start">
                <span>Browse Products</span>
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full justify-start" disabled>
              <span>Order History</span>
              <span className="text-xs text-gray-500 ml-2">Coming Soon</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}