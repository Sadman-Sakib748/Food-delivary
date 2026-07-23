'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import { menuAPI } from '@/lib/api'
import { MenuItem } from '@/types'
import { formatCurrency } from '@/lib/api/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function RestaurantMenuPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'restaurant') {
      router.push('/unauthorized')
      return
    }
    if (status === 'authenticated') {
      fetchMenu()
    }
  }, [status, session, router])

  const fetchMenu = async () => {
    try {
      setLoading(true)
      const response = await menuAPI.getAll()
      setMenuItems(response.data || [])
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await menuAPI.delete(id)
        await fetchMenu()
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await menuAPI.toggleStatus(id)
      await fetchMenu()
    } catch (error) {
      console.error('Error toggling item status:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600">Manage your restaurant menu</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          <option value="">All Categories</option>
          <option value="appetizers">Appetizers</option>
          <option value="mains">Mains</option>
          <option value="desserts">Desserts</option>
          <option value="beverages">Beverages</option>
          <option value="sides">Sides</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.isVegetarian && (
                    <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-600 rounded">Veg</span>
                  )}
                  {item.isSpicy && (
                    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded">Spicy</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-bold text-orange-600">{formatCurrency(item.price)}</span>
                  <span className="text-xs text-gray-400">• {item.category}</span>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => handleToggleStatus(item._id)}
                    className={`text-xs font-medium ${
                      item.isActive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1 ml-2">
                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-orange-600 hover:bg-orange-50 rounded" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded" 
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}