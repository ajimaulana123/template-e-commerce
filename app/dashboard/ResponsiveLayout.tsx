'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type Session = {
  userId: string
  email: string
  role: string
}

type Profile = {
  fotoProfil: string | null
} | null

export default function ResponsiveLayout({
  session,
  profile,
  children,
  logoutAction,
}: {
  session: Session
  profile: Profile
  children: React.ReactNode
  logoutAction: () => void
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Mobile Header - Only show on mobile */}
      <nav className="lg:hidden bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-screen lg:h-screen">
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            bg-white rounded-r-3xl lg:rounded-none shadow-2xl lg:shadow-none
            transform transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            ${isCollapsed ? 'lg:w-20' : 'w-80'}
          `}
        >
          <div className="h-full flex flex-col p-6 relative">
            {/* Toggle Button for Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 shadow-sm z-10"
            >
              <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'} text-xs text-gray-600`}></i>
            </button>

            {/* Profile Section */}
            <div className="mb-8">
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6`}>
                {!isCollapsed && (
                  <div className="flex items-center gap-3">
                    {profile?.fotoProfil ? (
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm">
                        <Image
                          src={profile.fotoProfil}
                          alt="Profile"
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                        <span className="text-xl font-bold text-white">
                          {session.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Welcome back,</p>
                      <h2 className="text-lg font-bold text-gray-900 truncate max-w-[150px]">
                        {session.email.split('@')[0]}
                      </h2>
                    </div>
                  </div>
                )}
                {isCollapsed && (
                  <div className="relative">
                    {profile?.fotoProfil ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                        <Image
                          src={profile.fotoProfil}
                          alt="Profile"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                        <span className="text-lg font-bold text-white">
                          {session.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto">
              <Link
                href="/dashboard"
                prefetch={true}
                className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl transition-all ${
                  isActive('/dashboard')
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsSidebarOpen(false)}
                title={isCollapsed ? 'Dashboard' : ''}
              >
                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                  <i className="fas fa-th-large w-5 text-center"></i>
                  {!isCollapsed && <span className="font-medium">Dashboard</span>}
                </div>
              </Link>

              <Link
                href="/dashboard/profile"
                prefetch={true}
                className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl transition-all ${
                  isActive('/dashboard/profile')
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsSidebarOpen(false)}
                title={isCollapsed ? 'Profile' : ''}
              >
                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                  <i className="fas fa-user w-5 text-center"></i>
                  {!isCollapsed && <span className="font-medium">Profile</span>}
                </div>
              </Link>

              {session.role === 'ADMIN' && (
                <>
                  <Link
                    href="/dashboard/analytics"
                    prefetch={true}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl transition-all ${
                      pathname?.startsWith('/dashboard/analytics')
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                    title={isCollapsed ? 'Analytics' : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                      <i className="fas fa-chart-bar w-5 text-center"></i>
                      {!isCollapsed && <span className="font-medium">Analytics</span>}
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/categories"
                    prefetch={true}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl transition-all ${
                      pathname?.startsWith('/dashboard/categories')
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                    title={isCollapsed ? 'Categories' : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                      <i className="fas fa-folder w-5 text-center"></i>
                      {!isCollapsed && <span className="font-medium">Categories</span>}
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/products"
                    prefetch={true}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl transition-all ${
                      pathname?.startsWith('/dashboard/products')
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                    title={isCollapsed ? 'Products' : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                      <i className="fas fa-box w-5 text-center"></i>
                      {!isCollapsed && <span className="font-medium">Products</span>}
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/orders"
                    prefetch={true}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl transition-all ${
                      pathname?.startsWith('/dashboard/orders')
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                    title={isCollapsed ? 'Orders' : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                      <i className="fas fa-shopping-bag w-5 text-center"></i>
                      {!isCollapsed && <span className="font-medium">Orders</span>}
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/questions"
                    prefetch={true}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl transition-all ${
                      pathname?.startsWith('/dashboard/questions')
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                    title={isCollapsed ? 'Questions' : ''}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                      <i className="fas fa-comment-dots w-5 text-center"></i>
                      {!isCollapsed && <span className="font-medium">Questions</span>}
                    </div>
                  </Link>
                </>
              )}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <form action={logoutAction} className="w-full">
                <button
                  type="submit"
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full`}
                  title={isCollapsed ? 'Sign Out' : ''}
                >
                  <i className="fas fa-sign-out-alt w-5 text-center"></i>
                  {!isCollapsed && <span className="font-medium">Sign Out</span>}
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </>
  )
}
