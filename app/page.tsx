import ScrollBanner from '@/components/ScrollBanner'
import MainNavbar from '@/components/MainNavbar'
import HeroSlider from '@/components/HeroSlider'
import HomePageClient from './HomePageClient'

export default function Home() {
  return (
    <>
      <ScrollBanner />
      <MainNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-32 sm:pt-28 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-36">
          {/* Hero Slider */}
         <div className="container mx-auto px-4 mt-10 md:mt-7 xl:mt-5">
            <HeroSlider />
          </div>

          {/* Main Content */}
          <HomePageClient />
        </div>
      </div>
    </>
  )
}
