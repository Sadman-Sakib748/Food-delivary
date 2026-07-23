'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { MenuItem } from '@/types'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/lib/api/utils'

interface MenuItemCardProps {
  item: MenuItem
  restaurantId?: string
  restaurantName?: string
  onAddToCart?: (item: any) => void
}

export default function MenuItemCard({ 
  item, 
  restaurantId,
  restaurantName,
  onAddToCart 
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    
    const cartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image,
      restaurantId: restaurantId || (typeof item.restaurant === 'object' ? item.restaurant._id : item.restaurant),
      restaurantName: restaurantName || (typeof item.restaurant === 'object' ? item.restaurant.restaurantName : 'Restaurant'),
      customizations: [],
    }

    onAddToCart?.(cartItem)
    toast.success(`Added ${quantity}x ${item.name} to cart!`)
    
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 500)
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
          🍕
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
            </div>
            <span className="font-bold text-orange-600 whitespace-nowrap">
              {formatCurrency(item.price)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {item.isVegetarian && (
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                Vegetarian
              </span>
            )}
            {item.isSpicy && (
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                🌶️ Spicy
              </span>
            )}
            {item.preparationTime && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                ⏱️ {item.preparationTime} min
              </span>
            )}
            {!item.isActive && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-400 rounded-full">
                Unavailable
              </span>
            )}
          </div>

          {/* Quantity and Add Button */}
          <div className="flex items-center gap-3 mt-3">
            {item.isActive && (
              <>
                <div className="flex items-center gap-1 border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-gray-50 rounded-l-lg transition-colors"
                    disabled={isAdding}
                  >
                    <Minus className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:bg-gray-50 rounded-r-lg transition-colors"
                    disabled={isAdding}
                  >
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  isLoading={isAdding}
                >
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}