'use client'

import { MapPin, ShieldCheck, Truck, PackageSearch } from 'lucide-react'
import Link from 'next/link'
import { BannerConfig } from './types'

interface BannerContentProps {
  config: BannerConfig
  linkSize: 'sm' | 'md' | 'lg'
}

export default function BannerContent({ config, linkSize }: BannerContentProps) {
  return (
    <div className="flex items-center justify-between w-full gap-2 md:gap-4 text-[11px] md:text-[12px] font-medium py-1">
      
      {/* KIRI: Brand & Store Info */}
      <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
        {/* Logo: HANYA muncul di Desktop (sm ke atas) untuk hemat ruang mobile */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <div className="w-4 h-4 bg-[#22c55e] rotate-45 rounded-sm flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full -rotate-45" />
          </div>
          <span className="tracking-tighter font-bold flex items-center gap-1">
            <span className="text-white">HALAL</span>
            <span className="bg-[#22c55e] text-black px-1.5 py-0.5 rounded-sm text-[10px]">MART</span>
          </span>
        </div>

        {/* Garis Pemisah Desktop */}
        <div className="hidden sm:block w-[1px] h-4 bg-white/20" />

        {/* Store Info: Di mobile dibuat ringkas agar tidak patah baris */}
        <div className="flex items-center gap-2 text-gray-300 shrink-0">
          <span className="text-sky-400 font-bold">JP</span>
          <p className="truncate max-w-[150px] md:max-w-none">
            Tokyo Store <span className="hidden md:inline">• Senin - Minggu (10:00-22:00)</span>
          </p>
        </div>
      </div>

      {/* KANAN: Quick Links & Track Order */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Navigasi: HANYA muncul di Desktop (md ke atas) */}
        <nav className="hidden md:flex items-center gap-4 text-gray-400">
          <Link href="/store-location" className="flex items-center gap-1 hover:text-[#22c55e] transition-colors">
            <MapPin size={14} />
            Lokasi
          </Link>
          <Link href="/halal-certificate" className="flex items-center gap-1 hover:text-[#22c55e] transition-colors">
            <ShieldCheck size={14} />
            Sertifikat
          </Link>
          <Link href="/delivery-info" className="flex items-center gap-1 hover:text-[#22c55e] transition-colors">
            <Truck size={14} />
            Info
          </Link>
        </nav>

        {/* Tombol Track Order: Tetap ada di mobile tapi ukurannya pas */}
        <Link 
          href="/orders" 
          className="bg-[#22c55e] hover:bg-[#16a34a] text-black px-3 md:px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-green-500/10 shrink-0"
        >
          <PackageSearch size={14} className="md:size-[16px]" />
          <span className="text-[10px] md:text-[12px]">Track Order</span>
        </Link>
      </div>

    </div>
  )
}