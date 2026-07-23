'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { riderAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/api/utils'
import { Card } from '@/components/ui/Card'

export default function RiderEarningsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [earnings, setEarnings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'rider') {
      router.push('/unauthorized')
      return
    }
    if (status === 'authenticated') {
      fetchEarnings()
    }
  }, [status, session, router])

  const fetchEarnings = async () => {
    try {
      setLoading(true)
      const response = await riderAPI.getEarnings()
      setEarnings(response.data || {})
    } catch (error) {
      console.error('Error fetching earnings:', error)
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

  const stats = [
    { label: 'Total Earnings', value: formatCurrency(earnings?.total || 0), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'This Week', value: formatCurrency(earnings?.weekly || 0), icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Today', value: formatCurrency(earnings?.daily || 0), icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600">Track your delivery earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deliveries</h3>
        <div className="space-y-3">
          <p className="text-gray-500 text-center py-8">No recent deliveries</p>
        </div>
      </Card>
    </div>
  )
}