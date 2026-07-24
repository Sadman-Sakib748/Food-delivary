// store/cartStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  restaurantId?: string
  restaurantName?: string
  customizations?: any[]
}

interface CartStore {
  items: CartItem[]
  total: number
  restaurantId: string | null
  isHydrated: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  clearCartAndPersist: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  resetStore: () => void
  setHydrated: (state: boolean) => void
}

const initialState = {
  items: [],
  total: 0,
  restaurantId: null,
  isHydrated: false,
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state) => set({ isHydrated: state }),

      addItem: (item) =>
        set((state) => {
          if (state.restaurantId && state.restaurantId !== item.restaurantId) {
            return {
              items: [item],
              total: item.price * item.quantity,
              restaurantId: item.restaurantId || null,
            }
          }

          const existingItem = state.items.find((i) => i.id === item.id)
          let updatedItems
          if (existingItem) {
            updatedItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          } else {
            updatedItems = [...state.items, item]
          }
          const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return {
            items: updatedItems,
            total,
            restaurantId: state.restaurantId || item.restaurantId || null,
          }
        }),

      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id)
          const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return {
            items: updatedItems,
            total,
            restaurantId: updatedItems.length > 0 ? state.restaurantId : null,
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          )
          const filteredItems = updatedItems.filter((i) => i.quantity > 0)
          const total = filteredItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return {
            items: filteredItems,
            total,
            restaurantId: filteredItems.length > 0 ? state.restaurantId : null,
          }
        }),

      clearCart: () => {
        set({ items: [], total: 0, restaurantId: null })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage')
        }
      },

      clearCartAndPersist: () => {
        set({ items: [], total: 0, restaurantId: null })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart-storage')
          sessionStorage.removeItem('cart-storage')
        }
      },

      resetStore: () => {
        // Reset state
        set({ 
          items: [], 
          total: 0, 
          restaurantId: null,
          isHydrated: false 
        })
        
        // Remove all storage
        if (typeof window !== 'undefined') {
          const storageKeys = [
            'cart-storage',
            'persist:cart-storage',
            'cart',
            'food-cart',
            'cartItems'
          ]
          storageKeys.forEach(key => {
            localStorage.removeItem(key)
            sessionStorage.removeItem(key)
          })
        }
      },

      getTotalItems: () => {
        const state = get()
        return state.isHydrated ? state.items.reduce((sum, item) => sum + item.quantity, 0) : 0
      },

      getTotalPrice: () => {
        const state = get()
        return state.isHydrated ? state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true)
        }
      },
      partialize: (state) => ({ 
        items: state.items,
        restaurantId: state.restaurantId,
        total: state.total
      }),
    }
  )
)