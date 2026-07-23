"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuItem, RatingData, Restaurant } from '@/types';
import toast from 'react-hot-toast';

interface MenuCardProps {
    menu: MenuItem;
    restaurant: Restaurant | null;
    rating: RatingData;
    onRefresh?: () => void;
}

export default function MenuCard({
    menu,
    restaurant,
    rating,
    onRefresh,
}: MenuCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const menuName = menu?.name || menu?.title || 'Menu Item';
    const discountRate = (menu as any)?.discountRate || 0;
    const hasDiscount = discountRate > 0;
    const discountedPrice = menu?.price ? menu.price * (1 - discountRate / 100) : 0;
    const menuTags = (menu as any)?.tags || [];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleOrderNow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!restaurant) {
            toast.error('Restaurant information not available');
            return;
        }

        setIsAddingToCart(true);

        try {
            const cartItem = {
                menuItem: menu._id,
                name: menuName,
                price: menu.price,
                discountedPrice: hasDiscount ? discountedPrice : menu.price,
                quantity: 1,
                restaurant: restaurant._id,
                restaurantName: restaurant.restaurantName,
                image: menu.image,
                customizations: [],
            };

            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItemIndex = existingCart.findIndex(
                (item: any) => item.menuItem === menu._id
            );

            if (existingItemIndex > -1) {
                existingCart[existingItemIndex].quantity += 1;
            } else {
                existingCart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(existingCart));

            toast.success(`${menuName} added to cart! 🛒`);
            router.push(`/menu/${menu._id}`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            appetizers: 'Appetizers',
            mains: 'Main Course',
            desserts: 'Desserts',
            beverages: 'Beverages',
            sides: 'Sides',
            soups: 'Soups',
            salads: 'Salads',
            other: 'Other',
        };
        return labels[category] || category;
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            appetizers: '🍢',
            mains: '🍛',
            desserts: '🍰',
            beverages: '🥤',
            sides: '🍟',
            soups: '🍜',
            salads: '🥗',
            other: '📦',
        };
        return icons[category] || '🍽️';
    };

    const getRestaurantName = (rest: Restaurant | null): string => {
        if (!rest) return '';
        return rest.restaurantName || '';
    };

    const handleViewDetails = () => {
        router.push(`/menu/${menu._id}`);
    };

    return (
        <div
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={toggleWishlist}
                className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <div onClick={handleViewDetails} className="cursor-pointer">
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    {menu.image && !imageError ? (
                        <Image
                            src={menu.image}
                            alt={menuName}
                            width={400}
                            height={208}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => setImageError(true)}
                            priority={false}
                            unoptimized={false}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                            <span className="text-6xl">🍽️</span>
                        </div>
                    )}

                    {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            {discountRate}% OFF
                        </div>
                    )}

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <span>{getCategoryIcon(menu.category)}</span>
                        <span>{getCategoryLabel(menu.category)}</span>
                    </div>

                    {rating?.average && rating.count > 0 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-medium">{rating.average.toFixed(1)}</span>
                            <span className="text-gray-300 text-[10px]">({rating.count})</span>
                        </div>
                    )}

                    {restaurant?.isOpen === false && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm px-4 py-2 bg-red-500 rounded-full">
                                Currently Closed
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4">
                <Link href={`/menu/${menu._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-orange-600 transition">
                        {menuName}
                    </h3>
                </Link>

                {restaurant && (
                    <Link href={`/restaurants/${restaurant._id}`} className="text-sm text-gray-500 hover:text-orange-500 transition flex items-center gap-1 group">
                        <span className="text-gray-400">🏪</span>
                        <span className="group-hover:underline">{getRestaurantName(restaurant)}</span>
                    </Link>
                )}

                {menu.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{menu.description}</p>
                )}

                {menuTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {menuTags.slice(0, 3).map((tag: string, index: number) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{tag}</span>
                        ))}
                        {menuTags.length > 3 && <span className="text-xs text-gray-400">+{menuTags.length - 3}</span>}
                    </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                    {menu.isVegetarian && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">🌱 Veg</span>}
                    {menu.isSpicy && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">🌶️ Spicy</span>}
                    {menu.preparationTime && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">⏱️ {menu.preparationTime}min</span>}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                        {hasDiscount ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-orange-600">{formatPrice(discountedPrice)}</span>
                                <span className="text-sm text-gray-400 line-through">{formatPrice(menu.price)}</span>
                            </div>
                        ) : (
                            <span className="text-xl font-bold text-gray-800">{formatPrice(menu.price)}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleViewDetails} className="px-3 py-2 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 transition-all">View</button>
                        <button
                            onClick={handleOrderNow}
                            disabled={isAddingToCart || restaurant?.isOpen === false}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isHovered && restaurant?.isOpen !== false
                                    ? 'bg-orange-500 text-white shadow-lg scale-105'
                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                } ${(isAddingToCart || restaurant?.isOpen === false) && 'opacity-50 cursor-not-allowed'}`}
                        >
                            {isAddingToCart ? 'Adding...' : 'Order Now'}
                        </button>
                    </div>
                </div>

                {restaurant?.deliveryTime && (
                    <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                        <span>🚀</span>
                        <span>{restaurant.deliveryTime} min • ${restaurant.deliveryCharge?.toFixed(2) || '0'} delivery</span>
                        {restaurant.minimumOrder && <span className="ml-2">• Min. ${restaurant.minimumOrder}</span>}
                    </div>
                )}

                {restaurant?.isVerified && (
                    <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Restaurant
                    </div>
                )}
            </div>
        </div>
    );
}