import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    images: string[]
    stock: number
    category?: {
      name: string
    }
  }
}

interface WishlistStore {
  items: WishlistItem[]
  loading: boolean
  syncing: boolean
  
  // Actions
  setItems: (items: WishlistItem[]) => void
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  setLoading: (loading: boolean) => void
  setSyncing: (syncing: boolean) => void
  
  // Computed
  totalItems: () => number
  isInWishlist: (productId: string) => boolean
  getItem: (productId: string) => WishlistItem | undefined
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      syncing: false,

      setItems: (items) => set({ items }),

      addItem: (item) => set((state) => {
        const exists = state.items.find(i => i.productId === item.productId)
        
        if (exists) {
          // Item already in wishlist, don't add duplicate
          return state
        }
        
        // Add new item
        return { items: [...state.items, item] }
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
      })),

      clearWishlist: () => set({ items: [] }),

      setLoading: (loading) => set({ loading }),
      
      setSyncing: (syncing) => set({ syncing }),

      totalItems: () => {
        return get().items.length
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId)
      },

      getItem: (productId) => {
        return get().items.find(item => item.productId === productId)
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)
