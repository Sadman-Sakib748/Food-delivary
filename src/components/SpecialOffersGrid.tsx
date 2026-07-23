"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MenuItem, RatingData, Restaurant } from '@/types';
import { reviewAPI, menuAPI } from '@/lib/api';
import MenuCard from './MenuCard';

interface SpecialOffersGridProps {
  initialSpecials: MenuItem[];
  initialRestaurants: Restaurant[];
}

export default function SpecialOffersGrid({
  initialSpecials,
  initialRestaurants,
}: SpecialOffersGridProps) {
  const [specials, setSpecials] = useState<MenuItem[]>(initialSpecials || []);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants || []);
  const [ratings, setRatings] = useState<Record<string, RatingData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('📊 SpecialOffersGrid received:', { 
    specialsCount: specials.length, 
    restaurantsCount: restaurants.length 
  });
  console.log('📊 First special:', specials[0]);

  // Build restaurant map
  const restaurantMap = useMemo(() => {
    const map = new Map<string, Restaurant>();
    (restaurants || []).forEach((restaurant) => {
      if (restaurant?._id) {
        map.set(restaurant._id, restaurant);
      }
    });
    return map;
  }, [restaurants]);

  // Get restaurant by ID
  const getRestaurant = useCallback(
    (menu: MenuItem): Restaurant | null => {
      if (!menu) return null;
      
      // If restaurant is directly an object
      if (typeof menu.restaurant === 'object' && menu.restaurant !== null) {
        return menu.restaurant as Restaurant;
      }

      // If restaurant is a string ID
      if (typeof menu.restaurant === 'string') {
        return restaurantMap.get(menu.restaurant) || null;
      }

      return null;
    },
    [restaurantMap]
  );

  // Fetch ratings
  useEffect(() => {
    const menuIds = (specials || [])
      .map((menu) => menu?._id)
      .filter((id): id is string => Boolean(id));

    if (!menuIds.length) return;

    let isMounted = true;

    const fetchRatings = async () => {
      try {
        const ratingMap: Record<string, RatingData> = {};
        
        for (const menuId of menuIds) {
          try {
            const response = await reviewAPI.getMenuItemReviews(menuId);
            if (response?.data) {
              const reviews = response.data || [];
              const total = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
              const average = reviews.length > 0 ? total / reviews.length : 0;
              ratingMap[menuId] = { average, count: reviews.length };
            }
          } catch (err) {
            console.error(`Failed to fetch ratings for ${menuId}:`, err);
          }
        }
        
        if (isMounted) {
          setRatings(ratingMap);
        }
      } catch (err) {
        console.error('Failed to fetch ratings:', err);
      }
    };

    fetchRatings();

    return () => {
      isMounted = false;
    };
  }, [specials]);

  // Refresh special offers
  const refreshSpecials = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await menuAPI.getAll({ limit: 8 });
      
      let menus: MenuItem[] = [];
      let restaurantsData: Restaurant[] = [];
      
      if (response) {
        if (response.items && Array.isArray(response.items)) {
          menus = response.items;
        } else if (response.data && Array.isArray(response.data)) {
          menus = response.data;
        } else if (Array.isArray(response)) {
          menus = response;
        } else if (response.menus) {
          menus = response.menus;
          restaurantsData = response.restaurants || [];
        }
      }
      
      setSpecials(menus);
      setRestaurants(restaurantsData);
      
      if (menus.length === 0) {
        setError('No menus available');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="w-full lg:w-1/2 p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-medium">⚠️ {error}</p>
          <button
            onClick={refreshSpecials}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!specials || specials.length === 0) {
    return (
      <div className="w-full lg:w-1/2">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">
            No Menus Available
          </h4>
          <p className="text-gray-500">Check back later for amazing deals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {specials.length} Special Offers
        </h3>
        <button
          onClick={refreshSpecials}
          disabled={loading}
          className="text-sm text-orange-500 hover:text-orange-600 font-medium transition disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      <div
        className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide pr-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
        role="region"
        aria-label="Special offer menus"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
          {specials.map((menu) => {
            const restaurant = getRestaurant(menu);
            const rating = ratings[menu?._id] || { average: null, count: 0 };

            return (
              <MenuCard
                key={menu?._id || Math.random()}
                menu={menu}
                restaurant={restaurant}
                rating={rating}
                onRefresh={refreshSpecials}
              />
            );
          })}
        </div>
      </div>

      {specials.length > 4 && (
        <div className="text-center text-sm text-gray-400 mt-2">Scroll for more offers ↓</div>
      )}
    </div>
  );
}