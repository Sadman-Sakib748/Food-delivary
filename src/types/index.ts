// ============================================
// USER TYPES
// ============================================

export interface User {
  _id?: string
  id?: string
  name: string
  email: string
  role: 'customer' | 'restaurant' | 'rider' | 'admin' | 'moderator'
  phone?: string
  avatar?: string
  token?: string
  status?: 'active' | 'inactive' | 'banned'
  emailVerified?: boolean
  preferences?: {
    language: string
    theme: string
    notifications: boolean
  }
  restaurantName?: string
  cuisineType?: string[]
  operatingHours?: OperatingHour[]
  deliveryTime?: number
  deliveryCharge?: number
  minimumOrder?: number
  isVerified?: boolean
  totalOrders?: number
  totalRevenue?: number
  licenseNumber?: string
  vehicleType?: 'bike' | 'car' | 'scooter'
  earnings?: number
  completedDeliveries?: number
  rating?: number
  resetPasswordToken?: string
  resetPasswordExpire?: Date
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates?: {
    type: string
    coordinates: number[]
  }
}

export interface Preferences {
  language: 'en' | 'bn' | 'hi' | 'ar' | 'es'
  theme: 'light' | 'dark'
  notifications: boolean
}

export interface OperatingHour {
  day: string
  open: string
  close: string
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'customer' | 'restaurant' | 'rider'
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  pagination?: Pagination
}

export interface PaginatedResponse<T> {
  success: boolean
  count: number
  pagination: Pagination
  data: T[]
}

export interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

// ============================================
// RESTAURANT TYPES
// ============================================

export interface Restaurant {
  _id: string
  owner: string | User
  restaurantName: string
  description: string
  logo?: string
  banner?: string
  cuisineType: string[]
  rating: number
  reviewsCount: number
  address: Address
  phone: string
  email: string
  operatingHours: OperatingHour[]
  isOpen: boolean
  deliveryTime: number
  deliveryCharge: number
  minimumOrder: number
  status: 'active' | 'inactive' | 'suspended'
  isVerified: boolean
  totalOrders: number
  totalRevenue: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateRestaurantData {
  restaurantName: string
  description?: string
  cuisineType: string[]
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: number[]
  }
  phone: string
  email: string
  operatingHours?: OperatingHour[]
  deliveryTime?: number
  deliveryCharge?: number
  minimumOrder?: number
}

// ============================================
// MENU TYPES
// ============================================

export interface MenuItem {
  _id: string
  restaurant: string | Restaurant
  name: string
  description: string
  image?: string
  price: number
  title?: string
  discountRate?: number
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages' | 'sides' | 'soups' | 'salads' | 'other'
  isVegetarian: boolean
  isSpicy: boolean
  preparationTime: number
  rating: number
  tags?: string[]
  totalReviews: number
  customizations: Customization[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Customization {
  name: string
  options: CustomizationOption[]
}

export interface CustomizationOption {
  name: string
  price: number
}

export interface CreateMenuItemData {
  restaurant: string
  name: string
  description?: string
  price: number
  category: string
  isVegetarian?: boolean
  isSpicy?: boolean
  preparationTime?: number
  image?: string
  customizations?: {
    name: string
    options: string[]
    price?: number
  }[]
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {
  isActive?: boolean
}

// ============================================
// ORDER TYPES
// ============================================

export interface Order {
  _id: string
  orderNumber: string
  customer: string | User
  restaurant: string | Restaurant
  rider?: string | User
  items: OrderItem[]
  deliveryAddress: Address
  subtotal: number
  tax: number
  deliveryCharge: number
  discount: number
  totalAmount: number
  paymentMethod: 'stripe' | 'bkash' | 'cod'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'
  specialInstructions?: string
  estimatedDeliveryTime?: Date
  actualDeliveryTime?: Date
  rating?: number
  review?: string
  riderRating?: number
  riderReview?: string
  statusHistory: StatusHistory[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  menuItem: string | MenuItem
  quantity: number
  price: number
  customizations: OrderItemCustomization[]
}

export interface OrderItemCustomization {
  name: string
  option: string
  price: number
}

export interface StatusHistory {
  status: string
  timestamp: Date
  note?: string
}

export interface CreateOrderData {
  restaurant: string
  items: {
    menuItem: string
    quantity: number
    customizations?: {
      name: string
      option: string
      price?: number
    }[]
  }[]
  deliveryAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: 'stripe' | 'bkash' | 'cod'
  specialInstructions?: string
}

export interface UpdateOrderStatusData {
  orderStatus: string
  note?: string
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  _id: string
  customer: string | User
  restaurant?: string | Restaurant
  menuItem?: string | MenuItem
  rider?: string | User
  rating: number
  comment: string
  reviewType: 'restaurant' | 'menuItem' | 'rider'
  helpful: number
  unhelpful: number
  isVerified: boolean
  status: 'active' | 'hidden' | 'flagged'
  createdAt: Date
  updatedAt: Date
}

export interface CreateReviewData {
  restaurant?: string
  menuItem?: string
  rider?: string
  rating: number
  comment: string
  reviewType: 'restaurant' | 'menuItem' | 'rider'
}

export interface UpdateReviewData {
  rating?: number
  comment?: string
}

// ============================================
// BLOG TYPES
// ============================================

export interface Blog {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string | User
  category: 'food' | 'health' | 'lifestyle' | 'recipes' | 'tips' | 'news'
  tags: string[]
  featuredImage: string
  isPublished: boolean
  views: number
  likes: number
  readingTime: number
  comments: BlogComment[]
  createdAt: Date
  updatedAt: Date
}

export interface BlogComment {
  _id: string
  userId: string | User
  content: string
  createdAt: Date
}

export interface CreateBlogData {
  title: string
  content: string
  excerpt: string
  category: string
  tags?: string[]
  featuredImage?: string
  isPublished?: boolean
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  status?: 'draft' | 'published' | 'archived'
}

// ============================================
// SPECIAL OFFER TYPES
// ============================================

export interface SpecialOffer {
  _id: string
  restaurant: string | Restaurant
  title: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minimumOrderAmount?: number
  maxUsageCount?: number
  usageCount: number
  startDate: Date
  endDate: Date
  isActive: boolean
  applicableMenuItems?: string[] | MenuItem[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateSpecialOfferData {
  restaurantId: string
  title: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minimumOrderAmount?: number
  startDate: string
  endDate: string
  applicableMenuItems?: string[]
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export interface Subscription {
  _id: string
  user: string | User
  planType: 'free' | 'premium' | 'enterprise'
  status: 'active' | 'cancelled' | 'paused'
  startDate: Date
  endDate: Date
  renewalDate: Date
  paymentStatus: 'pending' | 'completed' | 'failed'
  autoRenewal: boolean
  features: string[]
  price: number
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  duration: string
  features: string[]
  limits: {
    maxOrdersPerMonth: number
    maxFavorites: number
    cashback: number
    deliveryDiscount: number
  }
  badge: string
  color: string
  savings?: string
}

export interface SubscribeData {
  planType: 'premium' | 'enterprise'
  paymentMethod?: string
}

// ============================================
// CONVERSATION & MESSAGE TYPES
// ============================================

export interface Conversation {
  _id: string
  participants: string[] | User[]
  participantDetails?: {
    _id: string
    name: string
    avatar?: string
    role: string
  }[]
  lastMessage?: {
    _id: string
    content: string
    sender: string | User
    createdAt: Date
    isRead: boolean
  }
  lastMessageTime?: Date
  unreadCount: number
  type: 'individual' | 'group' | 'order'
  orderId?: string
  isActive: boolean
  metadata: {
    orderNumber?: string
    restaurantId?: string
    customerId?: string
    riderId?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  _id: string
  conversationId: string
  sender: string | User
  receiver: string | User
  messageType: 'text' | 'image' | 'file' | 'location' | 'order_update'
  content: string
  isRead: boolean
  readBy: {
    userId: string
    readAt: Date
  }[]
  attachmentUrl?: string
  attachmentType?: 'image' | 'pdf' | 'document' | 'other'
  fileName?: string
  fileSize?: number
  relatedOrder?: string
  isDeleted: boolean
  deletedFor: string[]
  replyTo?: string
  metadata: {
    orderStatus?: string
    orderNumber?: string
    location?: {
      latitude: number
      longitude: number
      address?: string
    }
    productId?: string
    productName?: string
    productImage?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface SendMessageData {
  content?: string
  messageType?: 'text' | 'image' | 'file' | 'location' | 'order_update'
  attachmentUrl?: string
  replyToId?: string
  metadata?: any
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
  amount: number
  currency: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  enabled: boolean
}

// ============================================
// RIDER TYPES
// ============================================

export interface RiderOrder {
  _id: string
  orderNumber: string
  restaurant: Restaurant
  customer: User
  totalAmount: number
  deliveryAddress: Address
  orderStatus: string
  specialInstructions?: string
  createdAt: Date
}

export interface RiderEarnings {
  earnings: number
  completedOrders: number
  pendingOrders: number
}

export interface RiderDeliveryHistory {
  orders: Order[]
  pagination: Pagination
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  totalUsers: number
  totalRestaurants: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  activeRiders: number
  totalBlogs: number
  totalReviews: number
}

export interface RevenueStats {
  revenue: {
    total: number
    count: number
    average: number
  }
  byPaymentMethod: {
    _id: string
    total: number
    count: number
  }[]
}

export interface DailyStats {
  _id: string
  orders: number
  revenue: number
}

// ============================================
// RATING TYPES
// ============================================

export interface RatingData {
  average: number | null
  count: number
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface RestaurantFilters {
  search?: string
  cuisine?: string
  city?: string
  minRating?: number
  maxDeliveryTime?: number
  page?: number
  limit?: number
  sortBy?: string
}

export interface MenuFilters {
  restaurantId?: string
  category?: string
  search?: string
  isVegetarian?: boolean
  isSpicy?: boolean
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
}

export interface OrderFilters {
  status?: string
  page?: number
  limit?: number
  paymentStatus?: string
  restaurantId?: string
  customerId?: string
  startDate?: string
  endDate?: string
}

// ============================================
// SORT TYPES
// ============================================

export type SortOrder = 'asc' | 'desc'
export type SortField = 'createdAt' | 'rating' | 'price' | 'deliveryTime' | 'totalOrders' | 'totalRevenue'

export interface SortOptions {
  field: SortField
  order: SortOrder
}

// ============================================
// DATE RANGE TYPES
// ============================================

export interface DateRange {
  startDate?: string
  endDate?: string
}

// ============================================
// LOCATION TYPES
// ============================================

export interface Location {
  latitude: number
  longitude: number
  accuracy?: number
  address?: string
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  _id: string
  userId: string
  type: 'order' | 'payment' | 'delivery' | 'promotion' | 'system'
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: Date
}

// ============================================
// JWT TYPES
// ============================================

export interface JwtPayload {
  id: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// ============================================
// EXPORT ALL
// ============================================
