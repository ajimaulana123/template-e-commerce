export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

export function calculateDiscount(price: number, originalPrice: number | null): number | null {
  if (!originalPrice) return null
  const discount = ((originalPrice - price) / originalPrice) * 100
  return Math.round(discount)
}

export function getProductImages(images: string[]): string[] {
  // Return actual images from database
  return images && images.length > 0 ? images : []
}
