'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, Clock } from 'lucide-react'
import { orderAPI } from '@/lib/api'
import { Order } from '@/types'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/api/utils'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function RestaurantOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'restaurant') {
      router.push('/unauthorized')
      return
    }
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, session, router, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderAPI.getRestaurantOrders({ 
        status: statusFilter,
        page: pagination.page, 
        limit: pagination.limit 
      })
      setOrders(response.data || [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, { orderStatus: status })
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage your restaurant orders</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {['All', 'pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'in_transit', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status === 'All' ? '' : status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              (status === 'All' && !statusFilter) || statusFilter === status
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {order.items.length} items • {formatCurrency(order.totalAmount)}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {typeof item.menuItem === 'object' ? item.menuItem.name : item.menuItem}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                {order.orderStatus === 'pending' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order._id, 'confirmed')}>
                    Confirm
                  </Button>
                )}
                {order.orderStatus === 'confirmed' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order._id, 'preparing')}>
                    Start Preparing
                  </Button>
                )}
                {order.orderStatus === 'preparing' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order._id, 'ready')}>
                    Mark Ready
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {orders.length} of {pagination.total} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}