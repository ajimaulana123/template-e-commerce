import { useWishlistManager } from '@/lib/hooks/useWishlistManager'

export function useWishlistCount() {
  const { totalItems } = useWishlistManager()
  return totalItems
}