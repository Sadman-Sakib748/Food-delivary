"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Star,
    Clock,
    MapPin,
    Phone,
    Mail,
    ShoppingBag,
    Heart,
    Share2,
    Check,
    Plus,
    Minus,
    Loader2,
    Truck,
    DollarSign,
    Info,
    Users,
    ChefHat,
    Utensils,
    Store
} from 'lucide-react';
import { menuAPI, restaurantAPI, reviewAPI } from '@/lib/api';
import { MenuItem, Restaurant, Review } from '@/types';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/api/utils';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function MenuDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [menu, setMenu] = useState<MenuItem | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch menu item
            const menuResponse = await menuAPI.getById(id);
            console.log('Menu Response:', menuResponse);
            const menuData = menuResponse.data || menuResponse;
            setMenu(menuData);

            // Fetch restaurant if available
            if (menuData.restaurant) {
                const restaurantId = typeof menuData.restaurant === 'string'
                    ? menuData.restaurant
                    : menuData.restaurant._id;

                if (restaurantId) {
                    const restaurantResponse = await restaurantAPI.getById(restaurantId);
                    setRestaurant(restaurantResponse.data || restaurantResponse);
                }
            }

            // Fetch reviews
            try {
                const reviewsResponse = await reviewAPI.getMenuItemReviews(id);
                setReviews(reviewsResponse.data || []);
            } catch (err) {
                console.log('No reviews found');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load menu details');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = async () => {
        if (!menu) return;

        setIsAddingToCart(true);

        try {
            const cartItem = {
                menuItem: menu._id,
                name: menu.name,
                price: menu.price,
                quantity: quantity,
                restaurant: restaurant?._id || (typeof menu.restaurant === 'string' ? menu.restaurant : menu.restaurant?._id),
                restaurantName: restaurant?.restaurantName || 'Restaurant',
                image: menu.image,
                customizations: [],
            };

            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItemIndex = existingCart.findIndex(
                (item: any) => item.menuItem === menu._id
            );

            if (existingItemIndex > -1) {
                existingCart[existingItemIndex].quantity += quantity;
            } else {
                existingCart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(existingCart));

            toast.success(`${quantity}x ${menu.name} added to cart! 🛒`);
            router.push('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: menu?.name,
                text: `Check out ${menu?.name} at ${restaurant?.restaurantName}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!menu) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h2>
                    <p className="text-gray-500 mb-4">The menu item you're looking for doesn't exist.</p>
                    <Link href="/restaurants">
                        <Button>Browse Restaurants</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const discountRate = (menu as any)?.discountRate || 0;
    const hasDiscount = discountRate > 0;
    const discountedPrice = menu.price * (1 - discountRate / 100);
    const menuTags = (menu as any)?.tags || [];
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Restaurants
            </Link>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Image */}
                <div
                    className="relative rounded-2xl overflow-hidden bg-gray-100 h-[400px] lg:h-[500px]"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {menu.image && !imageError ? (
                        <Image
                            src={menu.image}
                            alt={menu.name}
                            fill
                            className={cn(
                                'object-cover transition-transform duration-700',
                                isHovered && 'scale-110'
                            )}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200">
                            <span className="text-8xl">🍽️</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {hasDiscount && (
                            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-full shadow-lg">
                                {discountRate}% OFF
                            </span>
                        )}
                        {menu.isVegetarian && (
                            <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg">
                                🌱 Vegetarian
                            </span>
                        )}
                        {menu.isSpicy && (
                            <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full shadow-lg">
                                🌶️ Spicy
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                            onClick={toggleWishlist}
                            className={cn(
                                'p-3 rounded-full shadow-lg transition-all',
                                isWishlisted
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            <Heart className={cn('w-5 h-5', isWishlisted && 'fill-white')} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all text-gray-600"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                    {/* Category */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Utensils className="w-4 h-4" />
                        <span className="capitalize">{menu.category}</span>
                        {menu.preparationTime && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <Clock className="w-4 h-4" />
                                <span>{menu.preparationTime} min</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900">{menu.name}</h1>

                    {/* Restaurant */}
                    {restaurant && (
                        <Link
                            href={`/restaurants/${restaurant._id}`}
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
                        >
                            <Store className="w-4 h-4" />
                            <span className="font-medium">{restaurant.restaurantName}</span>
                            {restaurant.isVerified && (
                                <Check className="w-4 h-4 text-green-500" />
                            )}
                        </Link>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                            <span className="text-gray-500">({reviews.length} reviews)</span>
                        </div>
                        {restaurant?.isOpen !== false && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                Open Now
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {menu.description && (
                        <p className="text-gray-600 leading-relaxed">{menu.description}</p>
                    )}

                    {/* Tags */}
                    {menuTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {menuTags.map((tag: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Price */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-3">
                            {hasDiscount ? (
                                <>
                                    <span className="text-3xl font-bold text-orange-600">
                                        {formatCurrency(discountedPrice)}
                                    </span>
                                    <span className="text-lg text-gray-400 line-through">
                                        {formatCurrency(menu.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(menu.price)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            isLoading={isAddingToCart}
                            size="lg"
                            className="flex-1"
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Add to Cart - {formatCurrency((hasDiscount ? discountedPrice : menu.price) * quantity)}
                        </Button>
                    </div>

                    {/* Delivery Info */}
                    {restaurant && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2 text-sm">
                                <Truck className="w-4 h-4 text-gray-400" />
                                <span>
                                    {restaurant.deliveryTime || 30} min delivery
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span>
                                    Delivery ${restaurant.deliveryCharge?.toFixed(2) || '0'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Info className="w-4 h-4 text-gray-400" />
                                <span>
                                    Min. order ${restaurant.minimumOrder || 0}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-12">
                <div className="flex gap-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={cn(
                            'pb-3 px-4 font-medium transition-colors relative',
                            activeTab === 'details'
                                ? 'text-orange-600 border-b-2 border-orange-600'
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={cn(
                            'pb-3 px-4 font-medium transition-colors relative',
                            activeTab === 'reviews'
                                ? 'text-orange-600 border-b-2 border-orange-600'
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        Reviews ({reviews.length})
                    </button>
                </div>

                <div className="py-6">
                    {activeTab === 'details' ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">About this item</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium capitalize">{menu.category}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Preparation Time</p>
                                    <p className="font-medium">{menu.preparationTime || 'N/A'} minutes</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Vegetarian</p>
                                    <p className="font-medium">{menu.isVegetarian ? 'Yes 🌱' : 'No'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Spicy</p>
                                    <p className="font-medium">{menu.isSpicy ? 'Yes 🌶️' : 'No'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">💬</div>
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                </div>
                            ) : (
                                reviews.map((review) => (
                                    <Card key={review._id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={cn(
                                                                        'w-4 h-4',
                                                                        i < review.rating
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : 'text-gray-300'
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="font-medium">{review.rating}.0</span>
                                                    </div>
                                                    <p className="text-gray-700 mt-2">{review.comment}</p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        By {typeof review.customer === 'object' ? review.customer.name : 'User'} • {formatDate(review.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <button className="hover:text-green-500 transition-colors">
                                                        Helpful ({review.helpful || 0})
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Similar Items Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <Card key={item} className="p-4 hover:shadow-lg transition-shadow">
                            <div className="h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center text-4xl">
                                🍕
                            </div>
                            <h4 className="font-medium mt-3">Similar Item {item}</h4>
                            <p className="text-sm text-gray-500">$12.99</p>
                            <Button size="sm" className="mt-2 w-full">View</Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}