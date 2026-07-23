'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Store, ShoppingBag, Menu, Settings, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function RestaurantDashboard() {
  const { data: session } = useSession()

  const stats = [
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: '$0', icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Orders', value: '0', icon: Clock, color: 'bg-orange-50 text-orange-600' },
    { label: 'Rating', value: '0.0', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
  ]

  const quickActions = [
    { icon: ShoppingBag, label: 'Manage Orders', href: '/restaurant/orders', color: 'bg-orange-100 text-orange-600' },
    { icon: Menu, label: 'Manage Menu', href: '/restaurant/menu', color: 'bg-blue-100 text-blue-600' },
    { icon: Store, label: 'Restaurant Info', href: '/restaurant/settings', color: 'bg-green-100 text-green-600' },
    { icon: Settings, label: 'Settings', href: '/restaurant/settings', color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}!</h1>
        <p className="text-gray-600 mt-1">Manage your restaurant and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
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
            <Link href="/restaurant/orders" className="text-sm text-orange-600 hover:text-orange-500">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popular Items</h3>
            <Link href="/restaurant/menu" className="text-sm text-orange-600 hover:text-orange-500">
              Manage Menu
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-8">No menu items yet</p>
            <Link href="/restaurant/menu">
              <Button fullWidth>Add Menu Items</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}