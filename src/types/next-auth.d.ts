import { DefaultSession } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'customer' | 'restaurant' | 'rider' | 'admin' | 'moderator'
      token?: string
      phone?: string
      avatar?: string
      status?: 'active' | 'inactive' | 'banned'
      restaurantName?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: 'customer' | 'restaurant' | 'rider' | 'admin' | 'moderator'
    token?: string
    phone?: string
    avatar?: string
    status?: 'active' | 'inactive' | 'banned'
    restaurantName?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: 'customer' | 'restaurant' | 'rider' | 'admin' | 'moderator'
    token?: string
    phone?: string
    avatar?: string
    status?: 'active' | 'inactive' | 'banned'
    restaurantName?: string
  }
}