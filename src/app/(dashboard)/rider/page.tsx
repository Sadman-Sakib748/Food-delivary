'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Truck, DollarSign, Clock, MapPin, CheckCircle, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function RiderDashboard() {
  const { data: session } = useSession()

  const stats = [
    { label: 'Earnings', value: '$0', icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Completed', value: '0', icon: CheckCircle, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Orders', value: '0', icon: Package, color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name}!</h1>
        <p className="text-gray-600 mt-1">Manage your deliveries and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Orders</h3>
            <Link href="/rider/orders" className="text-sm text-orange-600 hover:text-orange-500">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-8">No available orders</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Deliveries</h3>
            <Link href="/rider/history" className="text-sm text-orange-600 hover:text-orange-500">
              View History
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-gray-500 text-center py-8">No deliveries today</p>
          </div>
        </Card>
      </div>
    </div>
  )
}