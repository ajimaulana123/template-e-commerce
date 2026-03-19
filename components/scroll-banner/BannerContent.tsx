import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import BannerLogo from './BannerLogo'
import BannerLinks from './BannerLinks'
import { BannerConfig } from './types'

interface BannerContentProps {
  config: BannerConfig
  containerClass?: string
  linkSize?: 'sm' | 'md' | 'lg'
}

export default function BannerContent({ 
  config, 
  containerClass = 'container mx-auto',
  linkSize = 'md'
}: BannerContentProps) {
  const hasStoreInfo = !!config.storeInfo
  const hasStoreLocationLink = config.links.some(link => link.href === '/store-location')

  return (
    <div className={containerClass}>
      <div className={`${config.padding}`}>
        <div className="flex items-center justify-between gap-3">
          {/* Left side */}
          <div className={`flex items-center gap-3 ${hasStoreInfo ? 'min-w-0 flex-1' : 'flex-shrink-0'}`}>
            <BannerLogo size={config.logo.size} textSize={config.logo.textSize} />
            
            {hasStoreInfo && (
              <>
                <Badge variant="outline" className="h-6 border-gray-300 text-gray-400 px-1">
                  |
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`truncate bg-blue-50 text-blue-700 border-blue-200 ${config.logo.textSize === 'text-lg' ? 'text-sm' : 'text-xs'}`}
                >
                  {config.storeInfo}
                </Badge>
                {hasStoreLocationLink && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    asChild
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    <a href="/store-location">
                      Lokasi Toko
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Right side - Links */}
          <BannerLinks 
            links={config.links.filter(link => link.href !== '/store-location')} 
            size={linkSize}
          />
        </div>
      </div>
    </div>
  )
}
