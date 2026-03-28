'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import DashboardStatsSkeleton from '@/components/skeletons/DashboardStatsSkeleton'

interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalUsers: number
  pendingOrders: number
  lastUpdated: string
}

export default function DashboardStatsClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const clearCache = async () => {
    try {
      setRefreshing(true)
      await fetch('/api/dashboard/stats', { method: 'POST' })
      await fetchStats()
    } catch (err) {
      setError('Failed to refresh stats')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return <DashboardStatsSkeleton />
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Ringkasan Toko</h2>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Gagal memuat statistik</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <Button
                onClick={() => fetchStats()}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Ringkasan Toko</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Update: {new Date(stats.lastUpdated).toLocaleTimeString('id-ID')}
          </span>
          <Button
            onClick={clearCache}
            variant="ghost"
            size="sm"
            disabled={refreshing}
            className="text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pesanan</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Semua pesanan</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Produk</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-xs text-gray-500 mt-1">Produk dijual</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pelanggan</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Pengguna terdaftar</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-lg transition-shadow ${
          stats.pendingOrders > 0 ? 'border-orange-200 bg-orange-50' : ''
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs sm:text-sm mb-1 font-medium ${
                  stats.pendingOrders > 0 ? 'text-orange-700' : 'text-gray-600'
                }`}>
                  Perlu Diproses
                </p>
                <p className={`text-xl sm:text-2xl font-bold ${
                  stats.pendingOrders > 0 ? 'text-orange-900' : 'text-gray-900'
                }`}>
                  {stats.pendingOrders}
                </p>
                <p className={`text-xs mt-1 ${
                  stats.pendingOrders > 0 ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  Pesanan pending
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                stats.pendingOrders > 0 ? 'bg-orange-200' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  stats.pendingOrders > 0 ? 'text-orange-700' : 'text-gray-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}