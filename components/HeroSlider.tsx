'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "PRODUK HALAL",
      subtitle: "Terpercaya",
      hashtag: "#HalalMartJepang",
      description: "Belanja produk halal berkualitas di Tokyo",
      period: "Periode: 14 Maret s.d 14 April 2026",
      bgColor: "bg-gradient-to-r from-green-600 to-emerald-700",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
      cta: "DAPATKAN PRODUK HALAL TERBAIK UNTUK KELUARGA ANDA!"
    },
    {
      id: 2,
      title: "FLASH SALE",
      subtitle: "50% OFF",
      hashtag: "#SuperDiskon",
      description: "Produk pilihan dengan harga terbaik hari ini",
      period: "Terbatas sampai: 23:59 WIB",
      bgColor: "bg-gradient-to-r from-red-500 to-red-600",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop",
      cta: "BELANJA SEKARANG SEBELUM KEHABISAN!"
    },
    {
      id: 3,
      title: "MAKANAN HALAL",
      subtitle: "Fresh Daily",
      hashtag: "#FreshHalal",
      description: "Makanan segar halal setiap hari dari supplier terpercaya",
      period: "Stock terbatas - Buruan pesan!",
      bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=500&fit=crop",
      cta: "JAMINAN HALAL 100% BERSERTIFIKAT!"
    }
  ]

  const sideBanners = [
    {
      id: 1,
      title: "Pulsa & Oxymeter",
      subtitle: "Mulai dari",
      price: "Rp31.800",
      bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Tumbler Minum Stainless",
      subtitle: "DISKON",
      price: "32%",
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-500",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Pengering Kutek Kuku",
      subtitle: "Mulai Dari",
      price: "30RB-an",
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-500",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="w-full mb-8">
      <div className="flex gap-4 h-[400px]">
        {/* Left Side - Main Slider (60%) */}
        <div className="relative w-full lg:w-[60%] rounded-lg overflow-hidden shadow-lg">
          <div className="flex transition-transform duration-500 ease-in-out h-full"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide) => (
              <div key={slide.id} className={`min-w-full h-full ${slide.bgColor} relative flex items-center`}>
                <div className="container mx-auto px-6 lg:px-8 flex items-center h-full relative z-10">
                  {/* Content */}
                  <div className="text-white max-w-xl">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2">
                      {slide.title}
                    </h1>
                    <div className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 text-yellow-300">
                      {slide.subtitle}
                    </div>
                    <div className="text-base md:text-lg lg:text-xl font-semibold mb-3 text-yellow-200">
                      {slide.hashtag}
                    </div>
                    <p className="text-sm md:text-base lg:text-lg mb-2 opacity-90">
                      {slide.description}
                    </p>
                    <p className="text-xs md:text-sm lg:text-base mb-4 opacity-80">
                      {slide.period}
                    </p>
                    <div className="bg-yellow-400 text-gray-900 p-2 md:p-3 rounded-lg mb-4 font-bold text-xs md:text-sm lg:text-base">
                      {slide.cta}
                    </div>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-4 md:px-6 py-2 md:py-3">
                      Belanja Sekarang
                    </Button>
                  </div>

                  {/* Background Image */}
                  <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
                    <img 
                      src={slide.image} 
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all",
                  currentSlide === index ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Side Banners (40%) */}
        <div className="hidden lg:flex flex-col gap-4 w-[40%]">
          {/* Top 2 Banners */}
          <div className="flex gap-4 h-[48%]">
            {sideBanners.slice(0, 2).map((banner) => (
              <div 
                key={banner.id}
                className={`relative flex-1 ${banner.bgColor} rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300`}
              >
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
                  <div>
                    <h3 className="font-bold text-sm mb-1">{banner.title}</h3>
                    <p className="text-xs opacity-90">{banner.subtitle}</p>
                  </div>
                  <div className="text-2xl font-bold">{banner.price}</div>
                </div>
                <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-30">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom 1 Banner */}
          <div className="h-[48%]">
            <div 
              className={`relative w-full h-full ${sideBanners[2].bgColor} rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300`}
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                <div>
                  <h3 className="font-bold text-lg mb-2">{sideBanners[2].title}</h3>
                  <p className="text-sm opacity-90">{sideBanners[2].subtitle}</p>
                </div>
                <div className="text-4xl font-bold">{sideBanners[2].price}</div>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30">
                <img 
                  src={sideBanners[2].image} 
                  alt={sideBanners[2].title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}