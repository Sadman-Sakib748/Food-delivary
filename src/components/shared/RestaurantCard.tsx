'use client'

import Link from 'next/link'
import { Star, Clock, MapPin, Heart } from 'lucide-react'
import { Restaurant } from '@/types'
import { formatCurrency } from '@/lib/api/utils'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface RestaurantCardProps {
  restaurant: Restaurant
  showFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
}

export default function RestaurantCard({ 
  restaurant, 
  showFavorite = false,
  onFavoriteToggle 
}: RestaurantCardProps) {
  const isFavorite = false // This would come from a favorites store/context

  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-6xl">
            🍽️
          </div>
          {showFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onFavoriteToggle?.(restaurant._id)
              }}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart 
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`} 
              />
            </button>
          )}
          {restaurant.isVerified && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Verified
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {restaurant.restaurantName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {restaurant.cuisineType?.slice(0, 3).join(' • ')}
                {restaurant.cuisineType?.length > 3 && ' • +more'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <span className="text-sm font-medium text-green-700">
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-900">
                {restaurant.rating || 4.5}
              </span>
              <span className="text-sm text-gray-500">
                ({restaurant.reviewsCount || 0})
              </span>
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

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Min. order {formatCurrency(restaurant.minimumOrder || 0)}
            </span>
            <span className="text-sm font-medium text-orange-600">
              {formatCurrency(restaurant.deliveryCharge || 0)} delivery
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}