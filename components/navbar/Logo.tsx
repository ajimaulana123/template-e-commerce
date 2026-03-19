import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="flex items-center gap-2">
        <Badge 
          variant="default" 
          className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 transform rotate-45 rounded-sm p-0 border-0"
        />
        <div className="text-xl xl:text-2xl font-bold flex items-center gap-1">
          <span className="text-gray-800">Halal</span>
          <Badge 
            variant="outline" 
            className="text-xl xl:text-2xl font-bold text-green-600 border-green-600 bg-green-50 hover:bg-green-100 px-2"
          >
            Mart
          </Badge>
        </div>
      </div>
      
      {/* Tagline */}
      <div className="hidden lg:flex flex-col text-xs">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          🇯🇵 Halal Products in Tokyo
        </Badge>
      </div>
    </Link>
  )
}

export const MobileLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-1.5">
      <Badge 
        variant="default" 
        className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 transform rotate-45 rounded-sm p-0 border-0"
      />
      <div className="text-sm font-bold flex items-center gap-0.5">
        <span className="text-gray-800">Halal</span>
        <Badge 
          variant="outline" 
          className="text-sm font-bold text-green-600 border-green-600 bg-green-50 px-1.5"
        >
          Mart
        </Badge>
      </div>
    </Link>
  )
}
