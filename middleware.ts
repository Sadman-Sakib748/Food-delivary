import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/restaurants',
  '/restaurant/:path*',
  '/blog',
  '/blog/:path*',
  '/about',
  '/api/auth/:path*',
]

const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request })

  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes(':path*')) {
      const pattern = route.replace(':path*', '.*')
      return new RegExp(`^${pattern}$`).test(pathname)
    }
    return pathname === route || pathname.startsWith(route)
  })

  const isAuthRoute = authRoutes.includes(pathname)

  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token && isAuthRoute) {
    const role = token.role || 'customer'
    return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  if (token) {
    const userRole = token.role || 'customer'
    
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    if (pathname.startsWith('/restaurant') && userRole !== 'restaurant' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    if (pathname.startsWith('/rider') && userRole !== 'rider' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|uploads).*)'],
}