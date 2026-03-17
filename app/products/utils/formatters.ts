export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

export const calculateDiscount = (price: number, originalPrice: number | null) => {
  if (!originalPrice) return null
  const discount = ((originalPrice - price) / originalPrice) * 100
  return Math.round(discount)
}
