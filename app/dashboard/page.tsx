import { verifySession } from '@/lib/session'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'

export default async function DashboardPage() {
  const session = await verifySession()

  // Get quick stats for admin
  let quickStats = null
  if (session?.role === 'ADMIN') {
    const [totalOrders, totalProducts, totalUsers, pendingOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count({ where: { status: 'PENDING' } })
    ])

    quickStats = {
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang, Admin! 👋
          </h1>
          <p className="text-gray-600">Kelola toko online Anda dengan mudah dari sini</p>
        </div>
        
        {/* Quick Stats for Admin */}
        {session?.role === 'ADMIN' && quickStats && (
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Ringkasan Toko</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Pesanan</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{quickStats.totalOrders}</p>
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
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{quickStats.totalProducts}</p>
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
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{quickStats.totalUsers}</p>
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

              <Card className="hover:shadow-lg transition-shadow border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-orange-700 mb-1 font-medium">Perlu Diproses</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-900">{quickStats.pendingOrders}</p>
                      <p className="text-xs text-orange-600 mt-1">Pesanan pending</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Admin Quick Links */}
        {session?.role === 'ADMIN' && (
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Menu Utama</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/dashboard/orders"
                className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-500 hover:to-green-600 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-white transition-colors">Kelola Pesanan</h3>
                    <p className="text-sm text-gray-700 group-hover:text-green-50 transition-colors">Lihat dan proses pesanan pelanggan</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/products"
                className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-500 hover:to-purple-600 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-white transition-colors">Kelola Produk</h3>
                    <p className="text-sm text-gray-700 group-hover:text-purple-50 transition-colors">Tambah, edit, atau hapus produk</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/categories"
                className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-500 hover:to-orange-600 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-white transition-colors">Kelola Kategori</h3>
                    <p className="text-sm text-gray-700 group-hover:text-orange-50 transition-colors">Atur kategori produk toko Anda</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/analytics"
                className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-500 hover:to-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-white transition-colors">Lihat Statistik</h3>
                    <p className="text-sm text-gray-700 group-hover:text-blue-50 transition-colors">Analisis penjualan dan performa toko</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/questions"
                className="group p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:from-pink-500 hover:to-pink-600 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg group-hover:text-white transition-colors">Pertanyaan Produk</h3>
                    <p className="text-sm text-gray-700 group-hover:text-pink-50 transition-colors">Jawab pertanyaan dari pelanggan</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
