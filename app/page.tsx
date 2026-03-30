import ScrollBanner from '@/components/ScrollBanner'
import MainNavbar from '@/components/MainNavbar'
import HeroSection from './homepage/components/HeroSection'
import HomePageClient from './HomePageClient'

export default function Home() {
  return (
    <>
      <ScrollBanner />
      <MainNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-32 sm:pt-28 md:pt-24 lg:pt-28 xl:pt-32 2xl:pt-36">
          {/* Hero Section */}
          <div id="main-content" className="container mx-auto px-4 mt-[60px] md:mt-8 xl:mt-8">
            <HeroSection />
          </div>

          {/* Main Content */}
          <HomePageClient />
        </div>
      </div>
    </>
  )
}
