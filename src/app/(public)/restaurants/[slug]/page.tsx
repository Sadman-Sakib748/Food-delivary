'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Star, Clock, MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { restaurantAPI, menuAPI } from '@/lib/api'
import { Restaurant, MenuItem } from '@/types'
import { formatCurrency } from '@/lib/api/utils'
import Button from '@/components/ui/Button'

export default function RestaurantDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchRestaurantData()
    }
  }, [id])

  const fetchRestaurantData = async () => {
    try {
      setLoading(true)
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id),
        menuAPI.getRestaurantMenu(id)
      ])
      setRestaurant(restaurantRes.data || restaurantRes)
      setMenuItems(menuRes.data || menuRes || [])
    } catch (error) {
      console.error('Error fetching restaurant data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Restaurant not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
            🍽️
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.restaurantName}</h1>
            <p className="text-gray-600 mt-1">{restaurant.cuisineType?.join(' • ')}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{restaurant.rating || 4.5}</span>
                <span className="text-gray-500">({restaurant.reviewsCount || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime || 30} min</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.address?.city || 'City'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button size="sm">
                <Phone className="w-4 h-4 mr-2" />
                {restaurant.phone}
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                {restaurant.email}
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Website
              </Button>
            </div>
          </div>
          <div className="text-right">
            {restaurant.isOpen ? (
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">Open Now</span>
            ) : (
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">Closed</span>
            )}
            <p className="text-sm text-gray-500 mt-2">Min. order {formatCurrency(restaurant.minimumOrder || 0)}</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                🍕
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-orange-600">{formatCurrency(item.price)}</span>
                  {item.isVegetarian && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">Veg</span>
                  )}
                  {item.isSpicy && (
                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">Spicy</span>
                  )}
                </div>
              </div>
              <Button size="sm" className="flex-shrink-0">Add</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}