'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  AlertTriangle,
  Download
} from 'lucide-react'
import Image from 'next/image'
import { exportToCSV } from './utils'
import AnalyticsPageSkeleton from '@/components/skeletons/AnalyticsPageSkeleton'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    monthlyRevenue: number
    revenueGrowth: number
    totalOrders: number
    monthlyOrders: number
    ordersGrowth: number
    totalProducts: number
    lowStockProducts: number
    totalUsers: number
    monthlyUsers: number
  }
  ordersByStatus: Array<{ status: string; count: number }>
  topProducts: Array<{
    id: string
    name: string
    sold: number
    price: number
    images: string[]
  }>
  categoryRevenue: Array<{ name: string; revenue: number }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    total: number
    status: string
    createdAt: string
    user: { email: string }
  }>
}

export default function AnalyticsPageClient() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  const handleExportOrders = () => {
    if (!data?.recentOrders) return
    
    const exportData = data.recentOrders.map(order => ({
      'No. Pesanan': order.orderNumber,
      'Pelanggan': order.user.email,
      'Total': order.total,
      'Status': order.status,
      'Tanggal': new Date(order.createdAt).toLocaleDateString('id-ID')
    }))
    
    exportToCSV(exportData, 'orders')
  }

  const handleExportProducts = () => {
    if (!data?.topProducts) return
    
    const exportData = data.topProducts.map((product, index) => ({
      'Ranking': index + 1,
      'Nama Produk': product.name,
      'Terjual': product.sold,
      'Harga': product.price
    }))
    
    exportToCSV(exportData, 'top_products')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <AnalyticsPageSkeleton />
  }

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Analitik</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {refreshing ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.overview.totalRevenue)}
            </div>
            <div className="flex items-center text-xs mt-2">
              <span className="text-gray-600">Bulan ini: </span>
              <span className="ml-1 font-semibold">
                {formatCurrency(data.overview.monthlyRevenue)}
              </span>
            </div>
            {data.overview.revenueGrowth !== 0 && (
              <div className="flex items-center text-xs mt-1">
                {data.overview.revenueGrowth > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">
                      +{data.overview.revenueGrowth}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-red-600">
                      {data.overview.revenueGrowth}%
                    </span>
                  </>
                )}
                <span className="text-gray-500 ml-1">vs bulan lalu</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pesanan
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalOrders}</div>
            <div className="flex items-center text-xs mt-2">
              <span className="text-gray-600">Bulan ini: </span>
              <span className="ml-1 font-semibold">
                {data.overview.monthlyOrders}
              </span>
            </div>
            {data.overview.ordersGrowth !== 0 && (
              <div className="flex items-center text-xs mt-1">
                {data.overview.ordersGrowth > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">
                      +{data.overview.ordersGrowth}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-red-600">
                      {data.overview.ordersGrowth}%
                    </span>
                  </>
                )}
                <span className="text-gray-500 ml-1">vs bulan lalu</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Produk
            </CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalProducts}</div>
            {data.overview.lowStockProducts > 0 && (
              <div className="flex items-center text-xs mt-2 text-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>{data.overview.lowStockProducts} stok rendah</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalUsers}</div>
            <div className="flex items-center text-xs mt-2">
              <span className="text-gray-600">Bulan ini: </span>
              <span className="ml-1 font-semibold">
                +{data.overview.monthlyUsers}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.ordersByStatus.map(item => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produk Terlaris</CardTitle>
            <button
              onClick={handleExportProducts}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  {product.images[0] && (
                    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        priority={false}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.sold} terjual • {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Pendapatan per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.categoryRevenue
              .sort((a, b) => b.revenue - a.revenue)
              .map(item => {
                const maxRevenue = Math.max(...data.categoryRevenue.map(c => c.revenue))
                const percentage = (item.revenue / maxRevenue) * 100
                
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-semibold">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pesanan Terbaru</CardTitle>
          <button
            onClick={handleExportOrders}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">
                    No. Pesanan
                  </th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">
                    Pelanggan
                  </th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">
                    Total
                  </th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-2 text-sm">{order.user.email}</td>
                    <td className="py-3 px-2 text-sm font-semibold">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
