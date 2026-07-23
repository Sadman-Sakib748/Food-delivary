'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, Heart, Star, Clock } from 'lucide-react'
import { restaurantAPI } from '@/lib/api'
import { Restaurant } from '@/types'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function CustomerFavoritesPage() {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites()
    }
  }, [status])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      // This would be a dedicated favorites API endpoint
      const response = await restaurantAPI.getAll({ limit: 10 })
      setFavorites(response.data || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
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
        <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
        <p className="text-gray-600">Your favorite restaurants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((restaurant) => (
          <Card key={restaurant._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{restaurant.restaurantName}</h3>
                <p className="text-sm text-gray-500">{restaurant.cuisineType?.join(' • ')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating || 4.5}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{restaurant.deliveryTime || 30} min</span>
                  </div>
                </div>
              </div>
              <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                <Heart className="w-5 h-5 fill-red-500" />
              </button>
            </div>
            <Button size="sm" className="mt-3 w-full">View Restaurant</Button>
          </Card>
        ))}
      </div>

      {favorites.length === 0 && (
        <Card className="p-8 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No favorite restaurants yet</p>
          <Button className="mt-4">Browse Restaurants</Button>
        </Card>
      )}
    </div>
  )
}