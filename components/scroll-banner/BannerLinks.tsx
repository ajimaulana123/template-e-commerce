import { Button } from '@/components/ui/button'
import { BannerLink } from './types'

interface BannerLinksProps {
  links: BannerLink[]
  size?: 'sm' | 'md' | 'lg'
}

export default function BannerLinks({ links, size = 'md' }: BannerLinksProps) {
  const sizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'default' as const
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {links.map((link, index) => (
        <Button
          key={index}
          variant={link.variant === 'primary' ? 'default' : 'ghost'}
          size={sizeMap[size]}
          asChild
          className={link.variant === 'primary' ? 'bg-green-600 hover:bg-green-700' : 'hover:text-green-600'}
        >
          <a href={link.href}>
            {link.label}
          </a>
        </Button>
      ))}
    </div>
  )
}
