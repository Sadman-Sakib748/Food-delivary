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

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, session, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderAPI.getCustomerOrders({ page: pagination.page, limit: pagination.limit })
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
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600">View your order history</p>
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
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {typeof order.restaurant === 'object' ? order.restaurant.restaurantName : order.restaurant}
                </p>
                <p className="text-sm text-gray-600">
                  {order.items.length} items • {formatCurrency(order.totalAmount)}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No orders yet. Start ordering now!</p>
          <Button className="mt-4">Browse Restaurants</Button>
        </Card>
      )}

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