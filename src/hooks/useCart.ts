'use client'

import { useCartStore } from '@/store/cartStore'
import { useMemo } from 'react'

export function useCart() {
  const {
    items,
    total,
    restaurantId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
  } = useCartStore()

  const totalItems = useMemo(() => getTotalItems(), [getTotalItems])

  const isCartEmpty = useMemo(() => items.length === 0, [items])

  const subtotal = useMemo(() => total, [total])

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal > 20 ? 0 : 5.99
  }, [subtotal])

  const tax = useMemo(() => subtotal * 0.08, [subtotal])

  const grandTotal = useMemo(() => subtotal + deliveryFee + tax, [subtotal, deliveryFee, tax])

  return {
    items,
    totalItems,
    subtotal,
    deliveryFee,
    tax,
    grandTotal,
    restaurantId,
    isCartEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}