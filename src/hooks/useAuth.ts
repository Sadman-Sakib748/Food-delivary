'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@/types'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user.role as User['role']) || 'customer',
        avatar: session.user.avatar,
        phone: session.user.phone,
      })
      setLoading(false)
    } else if (status === 'unauthenticated') {
      setUser(null)
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [session, status])

  const requireAuth = (redirectTo = '/login') => {
    if (status === 'unauthenticated') {
      router.push(redirectTo)
      return false
    }
    return true
  }

  const requireRole = (roles: User['role'][], redirectTo = '/unauthorized') => {
    if (!user || !roles.includes(user.role)) {
      router.push(redirectTo)
      return false
    }
    return true
  }

  const isAdmin = user?.role === 'admin'
  const isRestaurant = user?.role === 'restaurant'
  const isRider = user?.role === 'rider'
  const isCustomer = user?.role === 'customer'

  return {
    user,
    loading,
    isAuthenticated: status === 'authenticated',
    status,
    requireAuth,
    requireRole,
    isAdmin,
    isRestaurant,
    isRider,
    isCustomer,
    session,
  }
}