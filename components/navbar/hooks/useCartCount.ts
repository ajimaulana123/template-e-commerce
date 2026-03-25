import { useCart } from '@/lib/hooks/useCart'

export const useCartCount = () => {
  const { totalItems } = useCart()
  return totalItems
}
