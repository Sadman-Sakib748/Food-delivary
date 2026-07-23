import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      restaurantId: null,

      addItem: (item) =>
        set((state) => {
          // If adding from different restaurant, clear cart
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

      clearCart: () => set({ items: [], total: 0, restaurantId: null }),

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)