'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, User, Mail, Shield, Calendar, Camera, ShoppingCart, Package, Heart } from 'lucide-react'

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <p className="text-gray-600 mb-6">Unable to load your profile information</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardContent className="pt-0 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                      <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {user.profile?.fotoProfil ? (
                          <img
                            src={user.profile.fotoProfil}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h2 className="mt-4 text-xl font-bold text-gray-900">{user.email.split('@')[0]}</h2>
                  <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'ADMIN' ? '👑 Administrator' : '🛍️ Customer'}
                  </span>
                  
                  <div className="w-full mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Member since {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-sm text-gray-700">Total Orders</span>
                    </div>
                    <span className="font-bold text-gray-900">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 text-red-600 mr-3" />
                      <span className="text-sm text-gray-700">Wishlist Items</span>
                    </div>
                    <span className="font-bold text-gray-900">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm text-gray-700">Cart Items</span>
                    </div>
                    <span className="font-bold text-gray-900">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Account Information</h3>
                      <p className="text-sm text-gray-600">Your personal details</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      Email Address
                    </label>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-gray-50 border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed. Contact administrator if needed.
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Shield className="w-4 h-4 mr-2 text-gray-500" />
                      Account Type
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-900 font-medium">
                        {user.role === 'ADMIN' ? 'Administrator Account' : 'Customer Account'}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        {user.role === 'ADMIN' 
                          ? 'Full access to dashboard and management features' 
                          : 'Standard shopping and order management access'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.role === 'ADMIN' && (
                    <Link href="/dashboard" className="block">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  
                  <Link href="/orders" className="block">
                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </Button>
                  </Link>
                  
                  <Link href="/wishlist" className="block">
                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                  </Link>
                  
                  <Link href="/cart" className="block">
                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Shopping Cart
                    </Button>
                  </Link>
                  
                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                      <i className="fas fa-shopping-bag w-4 h-4 mr-2"></i>
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Account Security</h4>
                    <p className="text-sm text-blue-800">
                      Your account is protected. If you notice any suspicious activity, please contact our support team immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}