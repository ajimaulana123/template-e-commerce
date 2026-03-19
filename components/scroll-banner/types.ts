export interface BannerLink {
  href: string
  label: string
  variant?: 'default' | 'primary'
}

export interface BannerConfig {
  logo: {
    size: string
    textSize: string
  }
  storeInfo?: string
  links: BannerLink[]
  padding: string
}
