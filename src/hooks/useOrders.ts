'use client'

import { useState, useEffect, useCallback } from 'react'
import { orderAPI } from '@/lib/api'
import { Order } from '@/types'
import toast from 'react-hot-toast'

interface UseOrdersOptions {
  status?: string
  page?: number
  limit?: number
  autoFetch?: boolean
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { status, page = 1, limit = 10, autoFetch = true } = options
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 10 })

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderAPI.getAll({ status, page, limit })
      setOrders(response.data || [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders')
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [status, page, limit])

  useEffect(() => {
    if (autoFetch) {
      fetchOrders()
    }
  }, [fetchOrders, autoFetch])

  const refetch = useCallback(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, { orderStatus: newStatus })
      toast.success('Order status updated!')
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status')
    }
  }, [refetch])

  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    try {
      await orderAPI.cancel(orderId, { reason })
      toast.success('Order cancelled!')
      await refetch()
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order')
    }
  }, [refetch])

  return {
    orders,
    loading,
    error,
    pagination,
    refetch,
    updateOrderStatus,
    cancelOrder,
  }
}