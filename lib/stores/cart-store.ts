import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  quantity: number
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

interface CartStore {
  items: CartItem[]
  loading: boolean
  syncing: boolean
  
  // Actions
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  setLoading: (loading: boolean) => void
  setSyncing: (syncing: boolean) => void
  
  // Computed
  totalItems: () => number
  totalPrice: () => number
  getItem: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      syncing: false,

      setItems: (items) => set({ items }),

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.productId === item.productId)
        
        if (existingItem) {
          // Update quantity if item exists
          return {
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }
        }
        
        // Add new item
        return { items: [...state.items, item] }
      }),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
            : item
        )
      })),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
      })),

      clearCart: () => set({ items: [] }),

      setLoading: (loading) => set({ loading }),
      
      setSyncing: (syncing) => set({ syncing }),

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        )
      },

      getItem: (productId) => {
        return get().items.find(item => item.productId === productId)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)
