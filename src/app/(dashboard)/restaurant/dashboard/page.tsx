'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Store, ShoppingBag, Menu, Settings, TrendingUp,
    Clock, DollarSign, Users, Star, Package,
    Calendar, ArrowRight, Loader2, Bell,
    CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { orderAPI, menuAPI, restaurantAPI } from '@/lib/api'
import { Order, MenuItem, Restaurant } from '@/types'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/api/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function RestaurantDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalItems: 0,
        rating: 0,
    })
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [popularItems, setPopularItems] = useState<MenuItem[]>([])
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== 'restaurant' && session?.user?.role !== 'admin') {
            router.push('/unauthorized')
            return
        }
        if (status === 'authenticated') {
            fetchDashboardData()
        }
    }, [status, session, router])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            // Fetch orders
            const ordersRes = await orderAPI.getRestaurantOrders({ limit: 10 })
            const orders = ordersRes.data || ordersRes || []
            setRecentOrders(orders)

            // Fetch menu items
            const menuRes = await menuAPI.getAll()
            const menuItems = menuRes.data || menuRes || []
            setPopularItems(menuItems.slice(0, 5))

            // Calculate stats
            const totalOrders = orders.length
            const totalRevenue = orders.reduce((sum: number, order: Order) => sum + (order.totalAmount || 0), 0)
            const pendingOrders = orders.filter((o: Order) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length

            setStats({
                totalOrders,
                totalRevenue,
                pendingOrders,
                totalItems: menuItems.length,
                rating: 4.5, // Mock rating
            })

            // Fetch restaurant info
            // const restaurantRes = await restaurantAPI.getById(session?.user?.restaurantId || '')
            // setRestaurant(restaurantRes.data || restaurantRes)

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Get status counts safely with fallback
    const getStatusCount = (statusType: string) => {
        return recentOrders.filter((o: Order) => o.orderStatus === statusType).length
    }

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600',
            change: '+12%'
        },
        {
            title: 'Revenue',
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            color: 'bg-green-50 text-green-600',
            change: '+8%'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'bg-orange-50 text-orange-600',
            change: '-3%'
        },
        {
            title: 'Menu Items',
            value: stats.totalItems,
            icon: Menu,
            color: 'bg-purple-50 text-purple-600',
            change: '+5%'
        },
    ]

    const quickActions = [
        { icon: ShoppingBag, label: 'Manage Orders', href: '/restaurant/orders', color: 'bg-orange-100 text-orange-600' },
        { icon: Menu, label: 'Manage Menu', href: '/restaurant/menu', color: 'bg-blue-100 text-blue-600' },
        { icon: Store, label: 'Restaurant Info', href: '/restaurant/info', color: 'bg-green-100 text-green-600' },
        { icon: Settings, label: 'Settings', href: '/restaurant/settings', color: 'bg-purple-100 text-purple-600' },
    ]

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {session?.user?.name}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage your restaurant and orders from here
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </Button>
                    <Link href="/restaurant/orders">
                        <Button size="sm">
                            View Orders
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mt-4">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Order Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100">
                    <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
                    <p className="text-sm text-yellow-700">Pending</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">{getStatusCount('preparing')}</p>
                    <p className="text-sm text-blue-700">Preparing</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                    <p className="text-2xl font-bold text-purple-600">{getStatusCount('ready')}</p>
                    <p className="text-sm text-purple-700">Ready</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                    <p className="text-2xl font-bold text-green-600">{getStatusCount('delivered')}</p>
                    <p className="text-sm text-green-700">Delivered</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-medium text-gray-900">{action.label}</h3>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Orders & Popular Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <Link href="/restaurant/orders" className="text-sm text-orange-600 hover:text-orange-500">
                            View All
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No orders yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.slice(0, 5).map((order: Order) => (
                                    <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus || 'pending')}`}>
                                                    {order.orderStatus || 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {order.items?.length || 0} items • {formatCurrency(order.totalAmount || 0)}
                                            </p>
                                        </div>
                                        <span className="text-sm text-gray-400">
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Popular Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Popular Items</CardTitle>
                        <Link href="/restaurant/menu" className="text-sm text-orange-600 hover:text-orange-500">
                            Manage Menu
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {popularItems.length === 0 ? (
                            <div className="text-center py-8">
                                <Menu className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No menu items yet</p>
                                <Link href="/restaurant/menu">
                                    <Button size="sm" className="mt-3">Add Menu Items</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {popularItems.map((item: MenuItem) => (
                                    <div key={item._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center text-xl">
                                                🍕
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                                            {item.isActive ? (
                                                <span className="text-xs text-green-600">Available</span>
                                            ) : (
                                                <span className="text-xs text-red-600">Unavailable</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Restaurant Status */}
            {restaurant && (
                <Card>
                    <CardHeader>
                        <CardTitle>Restaurant Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-gray-700">
                                    {restaurant.isOpen ? 'Open for business' : 'Currently closed'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span className="text-gray-700">
                                    Rating: {restaurant.rating || 4.5} ★ ({restaurant.reviewsCount || 0} reviews)
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-700">
                                    Avg. delivery: {restaurant.deliveryTime || 30} min
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}