import Link from 'next/link'
import { User, Settings, Package, LogOut, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User as UserType } from './types'

interface UserMenuProps {
  user: UserType | null
  loading: boolean
  onLogout: () => void
  mobile?: boolean
}

export const UserMenu = ({ user, loading, onLogout, mobile = false }: UserMenuProps) => {
  if (loading) {
    return <div className={`${mobile ? 'w-5 h-5' : 'w-8 h-8'} bg-gray-200 rounded-full animate-pulse`} />
  }

  if (!user) {
    if (mobile) {
      return (
        <Link href="/login">
          <User className="w-5 h-5 text-blue-600" />
        </Link>
      )
    }

    return (
      <Link href="/login" className="flex items-center space-x-1 lg:space-x-2 text-blue-600 hover:text-blue-700">
        <User className="w-5 h-5" />
        <span className="text-sm font-medium hidden xl:inline">Masuk / Daftar</span>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={mobile ? 'sm' : 'default'}
          className={mobile ? 'p-1' : 'flex items-center space-x-1 lg:space-x-2 text-blue-600 hover:text-blue-700'}
        >
          <User className="w-5 h-5" />
          {!mobile && (
            <span className="text-sm font-medium hidden xl:inline">
              {user.profile?.fotoProfil ? 'Profile' : user.email?.split('@')[0] || 'Profile'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <DropdownMenuLabel className="px-3 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-blue-100">
                {user.role === 'ADMIN' ? '👑 Administrator' : '🛍️ Customer'}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        {user.role === 'ADMIN' && (
          <DropdownMenuItem asChild className="cursor-pointer rounded-md mb-1">
            <Link href="/dashboard" className="flex items-center px-3 py-2 bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Settings className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium text-gray-900">Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild className="cursor-pointer rounded-md mb-1">
          <Link href="/profile" className="flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">My Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer rounded-md mb-1">
          <Link href="/wishlist" className="flex items-center px-3 py-2 bg-red-50 hover:bg-red-100 transition-colors">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Heart className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-medium text-gray-900">My Wishlist</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer rounded-md mb-1">
          <Link href="/orders" className="flex items-center px-3 py-2 bg-green-50 hover:bg-green-100 transition-colors">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">My Orders</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer rounded-md">
          <div className="flex items-center px-3 py-2 w-full bg-red-50 hover:bg-red-100 transition-colors rounded-md">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <LogOut className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-medium text-red-600">Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
