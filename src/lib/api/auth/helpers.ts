// src/lib/auth/helpers.ts
import { getSession } from 'next-auth/react'

export const getAuthToken = async () => {
  try {
    const session = await getSession()
    // Try multiple ways to get the token
    const token = session?.user?.token || 
                  (session?.user as any)?.token || 
                  localStorage.getItem('token')
    return token
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}