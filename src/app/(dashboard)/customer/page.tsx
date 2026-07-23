'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ShoppingBag, Heart, User, Clock, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function CustomerDashboard() {
  const { data: session } = useSession()

  const quickActions = [
    { icon: ShoppingBag, label: 'My Orders', href: '/customer/orders', color: 'bg-orange-100 text-orange-600' },
    { icon: Heart, label: 'Favorites', href: '/customer/favorites', color: 'bg-red-100 text-red-600' },
    { icon: User, label: 'Profile', href: '/customer/profile', color: 'bg-blue-100 text-blue-600' },
    { icon: MapPin, label: 'Addresses', href: '/customer/profile#addresses', color: 'bg-green-100 text-green-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}!</h1>
        <p className="text-gray-600 mt-1">Your food delivery dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-gray-900">{action.label}</h3>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link href="/customer/orders" className="text-sm text-orange-600 hover:text-orange-500">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-8">No orders yet. Start ordering now!</p>
            <Link href="/restaurants">
              <Button fullWidth>Browse Restaurants</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">0</span>
          </div>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-8">No active orders</p>
          </div>
        </Card>
      </div>
    </div>
  )
}