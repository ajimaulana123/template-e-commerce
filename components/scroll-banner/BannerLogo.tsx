import { Badge } from '@/components/ui/badge'
import { BRAND_NAME } from './constants'

interface BannerLogoProps {
  size: string
  textSize: string
}

export default function BannerLogo({ size, textSize }: BannerLogoProps) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Badge 
        variant="default" 
        className={`${size} bg-gradient-to-br from-green-400 to-green-600 transform rotate-45 rounded-sm p-0 border-0`}
      />
      <span className={`font-bold text-gray-800 ${textSize} whitespace-nowrap`}>
        {BRAND_NAME.first}
      </span>
      <Badge 
        variant="outline" 
        className={`${textSize} font-bold text-green-600 border-green-600 bg-green-50 hover:bg-green-100`}
      >
        {BRAND_NAME.second}
      </Badge>
    </div>
  )
}
