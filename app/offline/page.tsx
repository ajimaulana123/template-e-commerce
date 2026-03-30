'use client'

import { useState } from 'react'

export default function OfflinePage() {
  const [isReloading, setIsReloading] = useState(false)

  const handleReload = () => {
    setIsReloading(true)
    // Memberikan efek loading sebentar sebelum reload beneran
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-200 p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 text-center transform transition-all hover:scale-[1.01]">
        
        {/* Ikon dengan Animasi Pulse */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-full shadow-sm border border-gray-100">
            <svg
              className={`w-16 h-16 ${isReloading ? 'text-blue-500 animate-spin' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        {/* Teks Konten */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-3 tracking-tight">
          Oops! Kamu Offline
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sepertinya koneksi internetmu terputus. Jangan khawatir, cek router atau kuotamu dan coba tekan tombol di bawah.
        </p>

        {/* Tombol Interaktif */}
        <button
          onClick={handleReload}
          disabled={isReloading}
          className="group relative w-full inline-flex items-center justify-center px-8 py-3.5 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
        >
          {isReloading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menghubungkan...
            </span>
          ) : (
            "Coba Hubungkan Kembali"
          )}
        </button>

        <p className="mt-6 text-sm text-gray-400">
          Status: <span className="font-medium text-red-400">Terputus</span>
        </p>
      </div>
    </div>
  )
}