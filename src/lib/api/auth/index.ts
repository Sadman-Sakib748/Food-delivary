import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { JWT } from 'next-auth/jwt'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fasr-food.vercel.app/api'

// Define the role type
type UserRole = 'customer' | 'restaurant' | 'rider' | 'admin' | 'moderator'

// Extend the built-in session/user types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      token?: string
      phone?: string
      avatar?: string
      status?: 'active' | 'inactive' | 'banned'
      restaurantName?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: UserRole
    token?: string
    phone?: string
    avatar?: string
    status?: 'active' | 'inactive' | 'banned'
    restaurantName?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    token?: string
    phone?: string
    avatar?: string
    status?: 'active' | 'inactive' | 'banned'
    restaurantName?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()

          if (!res.ok || !data.success) {
            return null
          }

          const user = data.user || data.data?.user || {}
          
          // Safely determine the role with fallback
          let role: UserRole = 'customer'
          const userRole = user.role || user.userRole || 'customer'
          if (userRole === 'admin' || userRole === 'restaurant' || userRole === 'rider' || userRole === 'moderator') {
            role = userRole as UserRole
          }

          return {
            id: user._id || user.id || '',
            name: user.name || 'User',
            email: user.email || credentials.email,
            role: role,
            token: data.token || user.token || '',
            avatar: user.avatar || user.profileImage || '',
            phone: user.phone || user.mobile || '',
            status: user.status || 'active',
            restaurantName: user.restaurantName || user.businessName || '',
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.token = user.token
        token.phone = user.phone
        token.avatar = user.avatar
        token.status = user.status
        token.restaurantName = user.restaurantName
      }

      // If using OAuth provider, get token from account
      if (account?.access_token) {
        token.token = account.access_token as string
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.token = token.token as string
        session.user.phone = token.phone as string
        session.user.avatar = token.avatar as string
        session.user.status = token.status as 'active' | 'inactive' | 'banned'
        session.user.restaurantName = token.restaurantName as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    verifyRequest: '/login',
    newUser: '/register',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)

// Export types for use in other files
export type { UserRole }