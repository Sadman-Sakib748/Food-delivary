"use client";

import { useState, useEffect } from 'react';
import SpecialOffersGrid from './SpecialOffersGrid';
import { menuAPI } from '@/lib/api';
import { MenuItem, Restaurant } from '@/types';

export default function SpecialOffers() {
    const [specials, setSpecials] = useState<MenuItem[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpecials = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log('🔍 Fetching menus...');
                const response = await menuAPI.getAll({ limit: 8 });
                
                console.log('📦 Full Response:', response);
                
                let menus: MenuItem[] = [];
                let restaurantsData: Restaurant[] = [];
                
                // Check if response exists
                if (!response) {
                    console.error('❌ No response received');
                    setError('No data received from server');
                    setLoading(false);
                    return;
                }
                
                // Try different response structures
                if (response.items && Array.isArray(response.items)) {
                    console.log('✅ Found items array:', response.items.length);
                    menus = response.items;
                } 
                else if (response.data && Array.isArray(response.data)) {
                    console.log('✅ Found data array:', response.data.length);
                    menus = response.data;
                }
                else if (Array.isArray(response)) {
                    console.log('✅ Response is array:', response.length);
                    menus = response;
                }
                else if (response.menus && Array.isArray(response.menus)) {
                    console.log('✅ Found menus array:', response.menus.length);
                    menus = response.menus;
                    restaurantsData = response.restaurants || [];
                }
                else if (response.results && Array.isArray(response.results)) {
                    console.log('✅ Found results array:', response.results.length);
                    menus = response.results;
                }
                else if (response.docs && Array.isArray(response.docs)) {
                    console.log('✅ Found docs array:', response.docs.length);
                    menus = response.docs;
                }
                else if (response.success && response.data) {
                    const data = response.data;
                    if (Array.isArray(data)) {
                        menus = data;
                    } else if (data.items && Array.isArray(data.items)) {
                        menus = data.items;
                    } else if (data.menus && Array.isArray(data.menus)) {
                        menus = data.menus;
                    }
                }
                
                console.log('📊 Extracted menus count:', menus.length);
                
                // If menus is empty, set error
                if (menus.length === 0) {
                    console.warn('⚠️ No menus found in response');
                    
                    // Try to see if there's any data in the response
                    const responseStr = JSON.stringify(response);
                    console.log('Response contains menus?', responseStr.includes('menu'));
                    console.log('Response contains items?', responseStr.includes('items'));
                    
                    setError('No menus available at the moment');
                    setLoading(false);
                    return;
                }
                
                // Extract restaurants from menu items
                menus.forEach((menu) => {
                    if (menu.restaurant && typeof menu.restaurant === 'object') {
                        const restaurant = menu.restaurant as Restaurant;
                        if (restaurant._id && !restaurantsData.find(r => r._id === restaurant._id)) {
                            restaurantsData.push(restaurant);
                        }
                    }
                });
                
                console.log('✅ Setting specials:', menus.length);
                console.log('✅ First menu item:', menus[0]);
                
                setSpecials(menus);
                setRestaurants(restaurantsData);
                
            } catch (err) {
                console.error('❌ Error fetching menus:', err);
                setError(err instanceof Error ? err.message : 'Failed to load menus');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecials();
    }, []);

    if (loading) {
        return (
            <section className="text-black w-full mb-12">
                <div className="container px-4 mx-auto flex flex-col py-8 lg:flex-row gap-8">
                    <div className="w-full lg:w-1/2 rounded-xl overflow-hidden min-h-[400px] lg:h-[calc(100vh-2rem)] bg-gray-200 animate-pulse" />
                    <div className="w-full lg:w-1/2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="text-black w-full mb-12">
                <div className="container px-4 mx-auto py-12 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                        <p className="text-red-600 font-medium">⚠️ {error}</p>
                        <p className="text-sm text-gray-500 mt-2">Please check the console for more details</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="text-black w-full mb-12">
            <div className="container px-4 mx-auto flex flex-col py-8 lg:flex-row gap-8">
                {/* Left: sticky banner */}
                <div
                    className="w-full lg:w-1/2 rounded-xl overflow-hidden min-h-[400px] lg:h-[calc(100vh-2rem)] bg-cover bg-center mb-8 lg:mb-0 relative lg:sticky lg:top-4"
                    style={{
                        backgroundImage:
                            "url('https://i.ibb.co/S4pQbgpq/fried-chicken-in-orange-background.jpg')",
                    }}
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white">
                        <h2 className="text-3xl pb-24 sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                            SEE OUR <span className="text-orange-600">SPECIAL</span> OFFERS
                        </h2>
                    </div>
                </div>

                {/* Right: client component with data */}
                <SpecialOffersGrid
                    initialSpecials={specials}
                    initialRestaurants={restaurants}
                />
            </div>
        </section>
    );
}