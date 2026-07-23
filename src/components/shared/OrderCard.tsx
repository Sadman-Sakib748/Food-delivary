'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Clock, MapPin, Package } from 'lucide-react'
import { Order } from '@/types'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/api/utils'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface OrderCardProps {
  order: Order
  showActions?: boolean
  onStatusUpdate?: (orderId: string, status: string) => void
}

export default function OrderCard({ 
  order, 
  showActions = false,
  onStatusUpdate 
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getStatusSteps = () => {
    const steps = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'in_transit', 'delivered']
    const currentIndex = steps.indexOf(order.orderStatus)
    
    return steps.map((step, index) => ({
      label: step,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }))
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              {formatDate(order.createdAt)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            {typeof order.restaurant === 'object' ? order.restaurant.restaurantName : order.restaurant}
          </p>
          
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span>{order.items.length} items</span>
            <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {typeof order.deliveryAddress === 'object' ? order.deliveryAddress.city : 'Delivery'}
            </span>
          </div>

          {/* Order Items (expanded) */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {typeof item.menuItem === 'object' ? item.menuItem.name : item.menuItem}
                    </span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span>{formatCurrency(order.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-orange-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            <Package className="w-3 h-3 mr-1" />
            {expanded ? 'Hide' : 'Details'}
          </Button>

          {showActions && order.orderStatus === 'pending' && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate?.(order._id, 'confirmed')}
            >
              Confirm
            </Button>
          )}
          {showActions && order.orderStatus === 'confirmed' && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate?.(order._id, 'preparing')}
            >
              Prepare
            </Button>
          )}
          {showActions && order.orderStatus === 'preparing' && (
            <Button
              size="sm"
              onClick={() => onStatusUpdate?.(order._id, 'ready')}
            >
              Ready
            </Button>
          )}

          <Link href={`/orders/${order._id}`}>
            <Button size="sm" variant="ghost">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Progress */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {getStatusSteps().map((step, index) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : step.isCurrent 
                    ? 'bg-orange-500 text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.isCompleted ? '✓' : index + 1}
                </div>
                <span className="text-xs text-gray-500 mt-1 hidden sm:block">
                  {step.label.charAt(0).toUpperCase() + step.label.slice(1).replace('_', ' ')}
                </span>
              </div>
              {index < getStatusSteps().length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${
                  step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}