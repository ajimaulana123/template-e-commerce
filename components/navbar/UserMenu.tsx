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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <div>
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500">
              {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {user.role === 'ADMIN' && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            My Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/wishlist" className="flex items-center cursor-pointer">
            <Heart className="w-4 h-4 mr-2" />
            My Wishlist
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/orders" className="flex items-center cursor-pointer">
            <Package className="w-4 h-4 mr-2" />
            My Orders
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
