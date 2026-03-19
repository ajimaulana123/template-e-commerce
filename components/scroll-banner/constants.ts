import { BannerConfig } from './types'

export const BRAND_NAME = {
  first: 'Halal',
  second: 'Mart'
}

export const STORE_INFO = {
  full: '🇯🇵 Tokyo Store • Senin - Minggu (10:00-22:00) • Produk Halal Bersertifikat MUI & JAKIM',
  short: '🇯🇵 Tokyo • Buka Setiap Hari (10:00-22:00)'
}

export const LINKS = {
  storeLocation: { href: '/store-location', label: 'Lokasi Toko' },
  halalCertificate: { href: '/halal-certificate', label: 'Halal Certificate' },
  halalCertificateShort: { href: '/halal-certificate', label: 'Certificate' },
  halalCertificateMin: { href: '/halal-certificate', label: 'Halal' },
  deliveryInfo: { href: '/delivery-info', label: 'Delivery Info' },
  deliveryInfoShort: { href: '/delivery-info', label: 'Delivery' },
  trackOrder: { href: '/orders', label: 'Track Order', variant: 'primary' as const },
  trackOrderShort: { href: '/orders', label: 'Tracking', variant: 'primary' as const }
}

export const BANNER_CONFIGS: Record<string, BannerConfig> = {
  '2xl': {
    logo: { size: 'w-6 h-6', textSize: 'text-lg' },
    storeInfo: STORE_INFO.full,
    links: [
      LINKS.storeLocation,
      LINKS.halalCertificate,
      LINKS.deliveryInfo,
      LINKS.trackOrder
    ],
    padding: 'px-6 py-2.5'
  },
  xl: {
    logo: { size: 'w-6 h-6', textSize: 'text-base' },
    storeInfo: STORE_INFO.short,
    links: [
      LINKS.halalCertificate,
      LINKS.deliveryInfoShort,
      LINKS.trackOrder
    ],
    padding: 'px-4 py-2'
  },
  lg: {
    logo: { size: 'w-5 h-5', textSize: 'text-base' },
    links: [
      LINKS.halalCertificateShort,
      LINKS.deliveryInfoShort,
      LINKS.trackOrderShort
    ],
    padding: 'px-4 py-2'
  },
  md: {
    logo: { size: 'w-5 h-5', textSize: 'text-base' },
    links: [
      LINKS.halalCertificateMin,
      LINKS.trackOrderShort
    ],
    padding: 'px-4 py-2'
  },
  sm: {
    logo: { size: 'w-4 h-4', textSize: 'text-sm' },
    links: [
      LINKS.halalCertificateMin,
      LINKS.trackOrderShort
    ],
    padding: 'px-4 py-2'
  },
  xs: {
    logo: { size: 'w-3.5 h-3.5', textSize: 'text-xs' },
    links: [
      LINKS.trackOrderShort
    ],
    padding: 'px-3 py-1.5'
  }
}
