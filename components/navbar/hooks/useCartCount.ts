import { useCartStore } from '@/lib/stores/cart-store'

export const useCartCount = () => {
  // Subscribe directly to store for reactive updates
  const totalItems = useCartStore((state) => state.totalItems())
  return totalItems
}
