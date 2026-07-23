'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import { riderAPI } from '@/lib/api'
import { Order } from '@/types'
import { formatDate, formatCurrency } from '@/lib/api/utils'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function RiderOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'rider') {
      router.push('/unauthorized')
      return
    }
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, session, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await riderAPI.getAvailableOrders()
      setOrders(response.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const acceptOrder = async (orderId: string) => {
    try {
      await riderAPI.acceptOrder(orderId)
      await fetchOrders()
    } catch (error) {
      console.error('Error accepting order:', error)
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
        <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
        <p className="text-gray-600">Pick up orders for delivery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <Card key={order._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-600 rounded-full">Available</span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Restaurant:</span> {typeof order.restaurant === 'object' ? order.restaurant.restaurantName : order.restaurant}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {typeof order.deliveryAddress === 'object' ? order.deliveryAddress.street : order.deliveryAddress}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-sm font-medium text-orange-600">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
              <Button size="sm" onClick={() => acceptOrder(order._id)}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No available orders at the moment</p>
        </Card>
      )}
    </div>
  )
}