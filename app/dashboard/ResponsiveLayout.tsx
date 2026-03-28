'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Mobile Header */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Menu Button + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                Dashboard
              </h1>
            </div>

            {/* Right: Profile + Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Profile Avatar */}
              <div className="flex items-center gap-2 sm:gap-3">
                {profile?.fotoProfil ? (
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
                    <Image
                      src={profile.fotoProfil}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 32px, 40px"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-300 shadow-sm">
                    <span className="text-sm sm:text-lg font-bold text-white">
                      {session.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                    {session.email}
                  </span>
                  <span className="text-xs text-gray-500">{session.role}</span>
                </div>
              </div>

              <div className="hidden sm:block h-8 w-px bg-gray-300"></div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-3 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-white border-r shadow-sm
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            mt-16 lg:mt-0
          `}
        >
          <nav className="p-4 space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dashboard/profile')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </Link>

            {session.role === 'ADMIN' && (
              <>
                <Link
                  href="/dashboard/analytics"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname?.startsWith('/dashboard/analytics')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Analytics</span>
                </Link>

                <Link
                  href="/dashboard/categories"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname?.startsWith('/dashboard/categories')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="fas fa-th-large w-5 h-5 flex items-center justify-center flex-shrink-0"></i>
                  <span>Categories</span>
                </Link>

                <Link
                  href="/dashboard/products"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname?.startsWith('/dashboard/products')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="fas fa-box w-5 h-5 flex items-center justify-center flex-shrink-0"></i>
                  <span>Products</span>
                </Link>

                <Link
                  href="/dashboard/orders"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname?.startsWith('/dashboard/orders')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>Orders</span>
                </Link>

                <Link
                  href="/dashboard/questions"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname?.startsWith('/dashboard/questions')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Product Questions</span>
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  )
}
