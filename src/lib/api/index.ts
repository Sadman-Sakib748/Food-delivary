import axios from 'axios'
import { getSession } from 'next-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fasr-food.vercel.app/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession()
      const token = session?.user?.token || (session?.user as any)?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      if (typeof window !== 'undefined') {
        const localStorageToken = localStorage.getItem('token')
        if (localStorageToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${localStorageToken}`
        }
      }
    } catch (error) {
      console.error('Error getting session:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: async (data: {
    name: string
    email: string
    password: string
    phone?: string
    avatar?: File | string
  }) => {
    if (data.avatar && data.avatar instanceof File) {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('password', data.password)
      if (data.phone) formData.append('phone', data.phone)
      formData.append('avatar', data.avatar)

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    }

    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (data: {
    name?: string
    phone?: string
    address?: any
    preferences?: any
    avatar?: string | File
  }) => {
    if (data.avatar && data.avatar instanceof File) {
      const formData = new FormData()
      if (data.name) formData.append('name', data.name)
      if (data.phone) formData.append('phone', data.phone)
      if (data.address) formData.append('address', JSON.stringify(data.address))
      if (data.preferences) formData.append('preferences', JSON.stringify(data.preferences))
      formData.append('avatar', data.avatar)

      const response = await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    }

    const response = await api.put('/auth/profile', data)
    return response.data
  },

  changePassword: async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    const response = await api.put('/auth/change-password', data)
    return response.data
  },

  // forgotPassword: async (data: { email: string }) => {
  //   const response = await api.post('/auth/forgot-password', data)
  //   return response.data
  // },

  // resetPassword: async (data: { token: string; newPassword: string }) => {
  //   const response = await api.post('/auth/reset-password', data)
  //   return response.data
  // },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

// ============================================
// RESTAURANT API
// ============================================

export const restaurantAPI = {
  getAll: async (params?: {
    search?: string
    cuisine?: string
    city?: string
    minRating?: number
    maxDeliveryTime?: number
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/restaurants', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/restaurants/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/restaurants', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/restaurants/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/restaurants/${id}`)
    return response.data
  },
}

// ============================================
// MENU API
// ============================================

export const menuAPI = {
  getAll: async (params?: {
    restaurantId?: string
    category?: string
    search?: string
    isVegetarian?: boolean
    isSpicy?: boolean
    priceMin?: number
    priceMax?: number
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/menu', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/menu/${id}`)
    return response.data
  },

  getRestaurantMenu: async (restaurantId: string) => {
    const response = await api.get(`/menu/restaurant/${restaurantId}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/menu', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/menu/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/menu/${id}`)
    return response.data
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/menu/${id}/toggle`)
    return response.data
  },
}

// ============================================
// ORDER API
// ============================================

export const orderAPI = {
  getAll: async (params?: {
    status?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  getByNumber: async (orderNumber: string) => {
    const response = await api.get(`/orders/number/${orderNumber}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/orders/stats')
    return response.data
  },

  getRiderOrders: async (params?: {
    status?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/orders/rider', { params })
    return response.data
  },

  getCustomerOrders: async (params?: {
    status?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/orders/customer', { params })
    return response.data
  },

  getRestaurantOrders: async (params?: {
    status?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/orders/restaurant', { params })
    return response.data
  },

  create: async (data: {
    restaurant: string
    items: {
      menuItem: string
      quantity: number
      customizations?: any[]
    }[]
    deliveryAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country?: string
    }
    paymentMethod: 'stripe' | 'bkash' | 'cod'
    specialInstructions?: string
  }) => {
    const response = await api.post('/orders', data)
    return response.data
  },

  updateStatus: async (id: string, data: {
    orderStatus: string
    note?: string
  }) => {
    const response = await api.put(`/orders/${id}/status`, data)
    return response.data
  },

  assignRider: async (id: string, data: { riderId: string }) => {
    const response = await api.put(`/orders/${id}/assign-rider`, data)
    return response.data
  },

  cancel: async (id: string, data?: { reason?: string }) => {
    const response = await api.put(`/orders/${id}/cancel`, data)
    return response.data
  },
}

// ============================================
// BLOG API
// ============================================

export const blogAPI = {
  getAll: async (params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
    tag?: string
  }) => {
    const response = await api.get('/blog', { params })
    return response.data
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/blog/slug/${slug}`)
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/blog/${id}`)
    return response.data
  },

  getCategories: async () => {
    const response = await api.get('/blog/categories')
    return response.data
  },

  getPopular: async (params?: { limit?: number }) => {
    const response = await api.get('/blog/popular', { params })
    return response.data
  },

  create: async (data: {
    title: string
    content: string
    excerpt: string
    category: string
    tags?: string[]
    featuredImage?: string
    isPublished?: boolean
  }) => {
    const response = await api.post('/blog', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/blog/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/blog/${id}`)
    return response.data
  },

  togglePublish: async (id: string) => {
    const response = await api.patch(`/blog/${id}/toggle`)
    return response.data
  },

  addComment: async (id: string, data: { content: string }) => {
    const response = await api.post(`/blog/${id}/comments`, data)
    return response.data
  },

  deleteComment: async (id: string, commentId: string) => {
    const response = await api.delete(`/blog/${id}/comments/${commentId}`)
    return response.data
  },

  like: async (id: string) => {
    const response = await api.post(`/blog/${id}/like`)
    return response.data
  },
}

// ============================================
// REVIEW API
// ============================================

export const reviewAPI = {
  getAll: async (params?: {
    restaurantId?: string
    menuItemId?: string
    riderId?: string
    rating?: number
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/reviews', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/reviews/${id}`)
    return response.data
  },

  getRestaurantReviews: async (restaurantId: string, params?: {
    page?: number
    limit?: number
    rating?: number
  }) => {
    const response = await api.get(`/reviews/restaurant/${restaurantId}`, { params })
    return response.data
  },

  getMenuItemReviews: async (menuItemId: string, params?: {
    page?: number
    limit?: number
  }) => {
    const response = await api.get(`/reviews/menu-item/${menuItemId}`, { params })
    return response.data
  },

  getRiderReviews: async (riderId: string, params?: {
    page?: number
    limit?: number
  }) => {
    const response = await api.get(`/reviews/rider/${riderId}`, { params })
    return response.data
  },

  create: async (data: {
    restaurant?: string
    menuItem?: string
    rider?: string
    rating: number
    comment: string
    reviewType: 'restaurant' | 'menuItem' | 'rider'
  }) => {
    const response = await api.post('/reviews', data)
    return response.data
  },

  update: async (id: string, data: {
    rating?: number
    comment?: string
  }) => {
    const response = await api.put(`/reviews/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },

  markHelpful: async (id: string) => {
    const response = await api.put(`/reviews/${id}/helpful`)
    return response.data
  },

  markUnhelpful: async (id: string) => {
    const response = await api.put(`/reviews/${id}/unhelpful`)
    return response.data
  },
}

// ============================================
// RIDER API
// ============================================

export const riderAPI = {
  getAvailableOrders: async (params?: {
    page?: number
    limit?: number
    latitude?: number
    longitude?: number
    radius?: number
  }) => {
    const response = await api.get('/rider/available-orders', { params })
    return response.data
  },

  acceptOrder: async (orderId: string, data?: { estimatedTime?: number }) => {
    const response = await api.put(`/rider/accept-order/${orderId}`, data)
    return response.data
  },

  updateOrderStatus: async (orderId: string, data: {
    orderStatus: 'picked_up' | 'in_transit' | 'delivered'
    note?: string
  }) => {
    const response = await api.put(`/rider/order/${orderId}/status`, data)
    return response.data
  },

  deliverOrder: async (orderId: string, data?: {
    deliveryPhoto?: string
    signature?: string
  }) => {
    const response = await api.put(`/rider/deliver-order/${orderId}`, data)
    return response.data
  },

  getCurrentOrder: async () => {
    const response = await api.get('/rider/current-order')
    return response.data
  },

  getEarnings: async (params?: {
    period?: 'today' | 'week' | 'month' | 'year'
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/rider/earnings', { params })
    return response.data
  },

  getDeliveryHistory: async (params?: {
    page?: number
    limit?: number
    status?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/rider/deliveries', { params })
    return response.data
  },

  updateLocation: async (data: {
    latitude: number
    longitude: number
    accuracy?: number
  }) => {
    const response = await api.put('/rider/location', data)
    return response.data
  },

  getStatus: async () => {
    const response = await api.get('/rider/status')
    return response.data
  },

  updateAvailability: async (data: { isAvailable: boolean; reason?: string }) => {
    const response = await api.put('/rider/availability', data)
    return response.data
  },
}

// ============================================
// ADMIN API
// ============================================

export const adminAPI = {
  getDashboardStats: async (params?: {
    period?: 'today' | 'week' | 'month' | 'year'
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/admin/stats', { params })
    return response.data
  },

  getRevenueStats: async (params?: {
    period?: 'today' | 'week' | 'month' | 'year'
    startDate?: string
    endDate?: string
    restaurantId?: string
  }) => {
    const response = await api.get('/admin/revenue', { params })
    return response.data
  },

  getUsers: async (params?: {
    page?: number
    limit?: number
    role?: string
    status?: string
    search?: string
  }) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  getUser: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  updateUserStatus: async (id: string, data: {
    status: 'active' | 'inactive' | 'banned'
    reason?: string
  }) => {
    const response = await api.put(`/admin/users/${id}/status`, data)
    return response.data
  },

  updateUserRole: async (id: string, data: {
    role: 'customer' | 'restaurant' | 'rider' | 'admin' | 'moderator'
    reason?: string
  }) => {
    const response = await api.put(`/admin/users/${id}/role`, data)
    return response.data
  },

  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  getRestaurants: async (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    isVerified?: boolean
    cuisine?: string
  }) => {
    const response = await api.get('/admin/restaurants', { params })
    return response.data
  },

  getRestaurant: async (id: string) => {
    const response = await api.get(`/admin/restaurants/${id}`)
    return response.data
  },

  verifyRestaurant: async (id: string) => {
    const response = await api.put(`/admin/restaurants/${id}/verify`)
    return response.data
  },

  updateRestaurantStatus: async (id: string, data: {
    status: 'active' | 'inactive' | 'suspended'
    reason?: string
  }) => {
    const response = await api.put(`/admin/restaurants/${id}/status`, data)
    return response.data
  },

  deleteRestaurant: async (id: string) => {
    const response = await api.delete(`/admin/restaurants/${id}`)
    return response.data
  },

  getAllOrders: async (params?: {
    page?: number
    limit?: number
    status?: string
    paymentStatus?: string
    restaurantId?: string
    customerId?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/admin/orders', { params })
    return response.data
  },

  getOrder: async (id: string) => {
    const response = await api.get(`/admin/orders/${id}`)
    return response.data
  },

  updateOrderStatus: async (id: string, data: {
    status: string
    reason?: string
  }) => {
    const response = await api.put(`/admin/orders/${id}/status`, data)
    return response.data
  },

  getBlogs: async (params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    search?: string
    author?: string
  }) => {
    const response = await api.get('/admin/blogs', { params })
    return response.data
  },

  getBlog: async (id: string) => {
    const response = await api.get(`/admin/blogs/${id}`)
    return response.data
  },

  createBlog: async (data: {
    title: string
    content: string
    category: string
    excerpt?: string
    tags?: string[]
    image?: string
    status?: 'draft' | 'published' | 'archived'
  }) => {
    const response = await api.post('/admin/blogs', data)
    return response.data
  },

  updateBlog: async (id: string, data: any) => {
    const response = await api.put(`/admin/blogs/${id}`, data)
    return response.data
  },

  deleteBlog: async (id: string) => {
    const response = await api.delete(`/admin/blogs/${id}`)
    return response.data
  },

  updateBlogStatus: async (id: string, data: {
    status: 'draft' | 'published' | 'archived'
    reason?: string
  }) => {
    const response = await api.put(`/admin/blogs/${id}/status`, data)
    return response.data
  },

  togglePublish: async (id: string) => {
    const response = await api.patch(`/admin/blogs/${id}/toggle`)
    return response.data
  },

  getReviews: async (params?: {
    page?: number
    limit?: number
    rating?: number
    status?: string
    restaurantId?: string
    userId?: string
    search?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/admin/reviews', { params })
    return response.data
  },

  getReview: async (id: string) => {
    const response = await api.get(`/admin/reviews/${id}`)
    return response.data
  },

  updateReviewStatus: async (id: string, data: {
    status: 'active' | 'hidden' | 'flagged'
    reason?: string
  }) => {
    const response = await api.put(`/admin/reviews/${id}/status`, data)
    return response.data
  },

  deleteReview: async (id: string) => {
    const response = await api.delete(`/admin/reviews/${id}`)
    return response.data
  },

  getReviewStats: async (params?: {
    restaurantId?: string
    startDate?: string
    endDate?: string
  }) => {
    const response = await api.get('/admin/reviews/stats', { params })
    return response.data
  },
}

// ============================================
// PAYMENT API
// ============================================

export const paymentAPI = {
  createPaymentIntent: async (data: { orderId: string }) => {
    const response = await api.post('/payments/create-payment-intent', data)
    return response.data
  },

  confirmPayment: async (data: { paymentIntentId: string }) => {
    const response = await api.post('/payments/confirm-payment', data)
    return response.data
  },

  getPaymentStatus: async (orderId: string) => {
    const response = await api.get(`/payments/status/${orderId}`)
    return response.data
  },

  refundPayment: async (data: {
    orderId: string
    amount?: number
    reason?: string
  }) => {
    const response = await api.post('/payments/refund', data)
    return response.data
  },

  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods')
    return response.data
  },
}

// ============================================
// SPECIAL OFFER API
// ============================================

export const specialOfferAPI = {
  getAll: async (params?: {
    restaurantId?: string
    isActive?: boolean
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/special-offers', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/special-offers/${id}`)
    return response.data
  },

  getActiveForRestaurant: async (restaurantId: string) => {
    const response = await api.get(`/special-offers/restaurant/${restaurantId}/active`)
    return response.data
  },

  create: async (data: {
    restaurantId: string
    title: string
    description?: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    minimumOrderAmount?: number
    startDate: string
    endDate: string
    applicableMenuItems?: string[]
  }) => {
    const response = await api.post('/special-offers', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/special-offers/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/special-offers/${id}`)
    return response.data
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/special-offers/${id}/toggle`)
    return response.data
  },
}

// ============================================
// SUBSCRIPTION API
// ============================================

export const subscriptionAPI = {
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans')
    return response.data
  },

  getMySubscription: async () => {
    const response = await api.get('/subscriptions/me')
    return response.data
  },

  subscribe: async (data: {
    planType: 'premium' | 'enterprise'
    paymentMethod?: string
  }) => {
    const response = await api.post('/subscriptions/subscribe', data)
    return response.data
  },

  cancel: async () => {
    const response = await api.post('/subscriptions/cancel')
    return response.data
  },

  pause: async () => {
    const response = await api.post('/subscriptions/pause')
    return response.data
  },

  resume: async () => {
    const response = await api.post('/subscriptions/resume')
    return response.data
  },

  getHistory: async (params?: {
    userId?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/subscriptions/history', { params })
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/subscriptions/stats')
    return response.data
  },

  updatePaymentStatus: async (data: {
    subscriptionId: string
    paymentStatus: 'pending' | 'completed' | 'failed'
  }) => {
    const response = await api.put('/subscriptions/payment-status', data)
    return response.data
  },
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  api,
  authAPI,
  restaurantAPI,
  menuAPI,
  orderAPI,
  blogAPI,
  reviewAPI,
  riderAPI,
  adminAPI,
  paymentAPI,
  specialOfferAPI,
  subscriptionAPI,
}