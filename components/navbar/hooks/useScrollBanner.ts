import { useState, useEffect } from 'react'

export const useScrollBanner = () => {
  const [bannerVisible, setBannerVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 50) {
        setBannerVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setBannerVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setBannerVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return bannerVisible
}
