'use client'

import Link from 'next/link'
import { User, Settings, Package, LogOut, Heart, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { User as UserType } from './types'

interface UserMenuProps {
  user: UserType | null
  loading: boolean
  onLogout: () => void
  mobile?: boolean
}

export const UserMenu = ({ user, loading, onLogout, mobile = false }: UserMenuProps) => {
  // Skeleton Loading yang lebih halus
  if (loading) {
    return <div className={cn("bg-gray-100 animate-pulse rounded-full", mobile ? 'w-8 h-8' : 'w-24 h-8')} />
  }

  // State: Belum Login
  if (!user) {
    return (
      <Link 
        href="/login" 
        className={cn(
          "flex items-center gap-2 transition-all duration-200",
          mobile ? "p-2 text-gray-700" : "px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 shadow-sm"
        )}
      >
        <User size={mobile ? 20 : 18} />
        {!mobile && <span className="text-sm font-semibold hidden lg:inline">Masuk</span>}
      </Link>
    )
  }

  // State: Sudah Login
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "group flex items-center gap-2 hover:bg-gray-50 transition-all",
            mobile ? "p-1 h-auto" : "px-3 py-6 rounded-xl border border-transparent hover:border-gray-200"
          )}
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold border-2 border-white shadow-sm">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          {!mobile && (
            <div className="flex items-center gap-1 hidden xl:flex">
              <span className="text-sm font-bold text-gray-700">
                {user.email?.split('@')[0]}
              </span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform group-data-[state=open]:rotate-180" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        // 1. Tambahkan bg-white eksplisit
        // 2. Gunakan shadow-2xl untuk memberikan efek kedalaman yang kuat
        // 3. Tambahkan border-gray-100 agar ada garis pemisah tipis dengan background putih
        className="w-64 p-2 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] animate-in fade-in zoom-in-95 duration-200"
      >
       <DropdownMenuLabel className="p-4 mb-2 bg-gray-50/80 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            {/* Icon User Box */}
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-green-200">
              <User size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 truncate tracking-tight">
                @{user.email?.split('@')[0]}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                {user.role === 'ADMIN' ? '🛡️ Administrator' : '👤 Customer'}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <div className="space-y-1">
          {user.role === 'ADMIN' && (
            <MenuLink href="/dashboard" icon={<Settings size={18} className="text-indigo-500" />} label="Admin Dashboard" />
          )}
          <MenuLink href="/profile" icon={<User size={18} className="text-blue-500" />} label="Profil Saya" />
          <MenuLink href="/wishlist" icon={<Heart size={18} className="text-pink-500" />} label="Wishlist" />
          <MenuLink href="/orders" icon={<Package size={18} className="text-orange-500" />} label="Pesanan Saya" />
        </div>
        
        <DropdownMenuSeparator className="my-2 bg-gray-100" />
        
        <DropdownMenuItem 
          onClick={onLogout} 
          className={cn(
            "flex items-center gap-3 p-2.5 cursor-pointer rounded-xl transition-all duration-200 group/logout",
            "text-gray-600 hover:text-red-600 hover:bg-red-50 hover:pl-4"
          )}
        >
          <div className="w-8 h-8 bg-gray-50 group-hover/logout:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
            <LogOut size={18} className="group-hover/logout:text-red-600" />
          </div>
          <span className="text-[13px] font-bold">Keluar dari Akun</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Sub-komponen untuk merapikan kode
const MenuLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <DropdownMenuItem asChild className="p-0 rounded-xl focus:bg-transparent">
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all duration-200",
        // Efek Hover: Background abu-abu muda, teks lebih gelap, dan geser dikit ke kanan
        "hover:bg-gray-100/80 hover:pl-4 group"
      )}
    >
      <div className="flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </Link>
  </DropdownMenuItem>
)