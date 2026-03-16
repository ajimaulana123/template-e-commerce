'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "BUKTIKAN KALAU",
      subtitle: "jaknot",
      hashtag: "#SudahPastiMurahnya",
      description: "Datang dan belanja langsung ke toko cabang terdekat",
      period: "Periode: 14 Maret s.d 14 April 2026",
      bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      cta: "DAPATKAN MERCHANDISE MENARIK KHUSUS PELANGGAN SETIA JAKARTANOTEBOOK!"
    },
    {
      id: 2,
      title: "FLASH SALE",
      subtitle: "50% OFF",
      hashtag: "#SuperDiskon",
      description: "Produk pilihan dengan harga terbaik hari ini",
      period: "Terbatas sampai: 23:59 WIB",
      bgColor: "bg-gradient-to-r from-red-500 to-red-600",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop",
      cta: "BELANJA SEKARANG SEBELUM KEHABISAN!"
    },
    {
      id: 3,
      title: "GADGET TERBARU",
      subtitle: "2024",
      hashtag: "#TeknoTerkini",
      description: "Koleksi gadget terbaru langsung dari Jepang",
      period: "Stock terbatas - Buruan pesan!",
      bgColor: "bg-gradient-to-r from-purple-600 to-purple-700",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
      cta: "JADI YANG PERTAMA MEMILIKI TEKNOLOGI TERDEPAN!"
    }
  ]

  const productCards = [
    {
      title: "Jas Hujan Kaliber",
      originalPrice: "Rp165.000",
      salePrice: "Rp165.000",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=150&fit=crop"
    },
    {
      title: "Kantong Celoper Pakaian",
      originalPrice: "Rp70.400",
      salePrice: "Rp70.400",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=150&fit=crop"
    },
    {
      title: "CCTV Mini 1080P",
      originalPrice: "Rp72.000",
      salePrice: "Rp42.400",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop"
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
    <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
      <div className="flex transition-transform duration-500 ease-in-out h-full"
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className={`min-w-full h-full ${slide.bgColor} relative flex items-center`}>
            <div className="container mx-auto px-6 flex items-center justify-between h-full">
              {/* Left Content */}
              <div className="text-white z-10 flex-1 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-2">
                  {slide.title}
                </h1>
                <div className="text-2xl md:text-4xl font-bold mb-4 text-yellow-300">
                  {slide.subtitle}
                </div>
                <div className="text-lg md:text-xl font-semibold mb-4 text-yellow-200">
                  {slide.hashtag}
                </div>
                <p className="text-base md:text-lg mb-2 opacity-90">
                  {slide.description}
                </p>
                <p className="text-sm md:text-base mb-6 opacity-80">
                  {slide.period}
                </p>
                <div className="bg-yellow-400 text-gray-900 p-3 rounded-lg mb-6 font-bold text-sm md:text-base">
                  {slide.cta}
                </div>
                <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-3">
                  Belanja Sekarang
                </Button>
              </div>

              {/* Right Content - Product Cards */}
              <div className="hidden lg:flex flex-col space-y-4 ml-8">
                {productCards.map((product, i) => (
                  <Card key={i} className="bg-white p-3 flex items-center space-x-3 w-64 hover:shadow-lg transition-shadow">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">{product.title}</h4>
                      <div className="flex items-center space-x-2">
                        {product.originalPrice !== product.salePrice && (
                          <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                        )}
                        <span className="text-sm font-bold text-red-600">{product.salePrice}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Background decoration */}
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
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
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"
            )}
          />
        ))}
      </div>
    </div>
  )
}