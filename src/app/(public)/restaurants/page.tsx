'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Star, Clock, MapPin, Filter } from 'lucide-react'
import { restaurantAPI } from '@/lib/api'
import { Restaurant } from '@/types'
import { formatCurrency } from '@/lib/api/utils'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await restaurantAPI.getAll()
      setRestaurants(response.data || response || [])
    } catch (error) {
      console.error('Error fetching restaurants:', error)
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
        <p className="text-gray-600 mt-1">Discover the best restaurants in your area</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-6xl">
                🍽️
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">{restaurant.restaurantName}</h3>
                <p className="text-gray-500 text-sm mt-1">{restaurant.cuisineType?.join(' • ') || 'Various Cuisines'}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{restaurant.rating || 4.5}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{restaurant.deliveryTime || 30} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{restaurant.address?.city || 'City'}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Min. order {formatCurrency(restaurant.minimumOrder || 0)}</span>
                  {restaurant.isOpen ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">Open</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">Closed</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}