import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'

// Cache configuration
const CACHE_DURATION = 60 * 5 // 5 minutes in seconds
let cachedData: any = null
let cacheTimestamp: number = 0

export async function GET() {
  try {
    const session = await verifySession()
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return cached data if still valid
    const now = Date.now()
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION * 1000) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
          'X-Cache': 'HIT'
        }
      })
    }

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Total Revenue
    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true }
    })

    // Monthly Revenue
    const monthlyRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: startOfMonth }
      },
      _sum: { total: true }
    })

    const lastMonthRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
      },
      _sum: { total: true }
    })

    // Total Orders
    const totalOrders = await prisma.order.count()
    const monthlyOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfMonth } }
    })
    const lastMonthOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }
    })

    // Total Products
    const totalProducts = await prisma.product.count()
    const lowStockProducts = await prisma.product.count({
      where: { stock: { lte: 10 } }
    })

    // Total Users
    const totalUsers = await prisma.user.count()
    const monthlyUsers = await prisma.user.count({
      where: { createdAt: { gte: startOfMonth } }
    })

    // Order Status Distribution
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    })

    // Top Selling Products
    const topProducts = await prisma.product.findMany({
      orderBy: { sold: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        sold: true,
        price: true,
        images: true
      }
    })

    // Revenue by Category
    const revenueByCategory = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { subtotal: true },
      _count: { id: true }
    })

    const productCategories = await prisma.product.findMany({
      select: {
        id: true,
        categoryId: true,
        category: { select: { name: true } }
      }
    })

    const categoryRevenue = productCategories.reduce((acc: any, product) => {
      const revenue = revenueByCategory.find(r => r.productId === product.id)
      if (revenue) {
        const categoryName = product.category.name
        if (!acc[categoryName]) {
          acc[categoryName] = 0
        }
        acc[categoryName] += revenue._sum.subtotal || 0
      }
      return acc
    }, {})

    // Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: { email: true }
        }
      }
    })

    // Calculate growth percentages
    const revenueGrowth = lastMonthRevenue._sum.total
      ? ((((monthlyRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / (lastMonthRevenue._sum.total || 1)) * 100)
      : 0

    const ordersGrowth = lastMonthOrders
      ? (((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100)
      : 0

    const responseData = {
      overview: {
        totalRevenue: totalRevenue._sum.total || 0,
        monthlyRevenue: monthlyRevenue._sum.total || 0,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        totalOrders,
        monthlyOrders,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
        totalProducts,
        lowStockProducts,
        totalUsers,
        monthlyUsers
      },
      ordersByStatus: ordersByStatus.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      topProducts,
      categoryRevenue: Object.entries(categoryRevenue).map(([name, revenue]) => ({
        name,
        revenue
      })),
      recentOrders
    }

    // Update cache
    cachedData = responseData
    cacheTimestamp = Date.now()

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// POST - Clear cache (admin only)
export async function POST() {
  try {
    const session = await verifySession()
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear cache
    cachedData = null
    cacheTimestamp = 0

    return NextResponse.json({ success: true, message: 'Cache cleared' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 })
  }
}
