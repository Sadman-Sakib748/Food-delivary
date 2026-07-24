"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, X, ShoppingBag, User, LogOut, 
  LayoutDashboard, Store, Truck, Heart,
  Home, BookOpen, MapPin, Info, Mail
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/api/utils'


export default function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname)
  if (isAuthPage) return null

  const navItems = [
    { href: '/', label: 'Home', icon: <Home size={18} /> },
    { href: '/menus', label: 'Menus', icon: <BookOpen size={18} /> },
    { href: '/restaurants', label: 'Restaurants', icon: <MapPin size={18} /> },
    { href: '/about', label: 'About', icon: <Info size={18} /> },
    { href: '/contact', label: 'Contact', icon: <Mail size={18} /> },
  ]

  const getDashboardLink = () => {
    if (!session?.user?.role) return '/login'
    const role = session.user.role
    if (role === 'admin') return '/admin'
    if (role === 'restaurant') return '/restaurant'
    if (role === 'rider') return '/rider'
    return '/customer'
  }

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Left: Menu Button (Mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold">
              Fast<span className="text-orange-500">Feast</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition rounded-lg',
                  pathname === item.href
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Icons & User */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/cart" className="relative text-gray-700 hover:text-orange-500 transition-colors p-2 rounded-lg hover:bg-orange-50">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {status === 'authenticated' && session?.user ? (
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200 hover:border-orange-300 transition-colors">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-orange-600" size={18} />
                )}
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-900 text-sm">{session.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>

                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>

                {session.user.role === 'customer' && (
                  <>
                    <Link
                      href="/customer/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Store size={16} /> My Orders
                    </Link>
                    <Link
                      href="/customer/favorites"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart size={16} /> Favorites
                    </Link>
                  </>
                )}

                {session.user.role === 'restaurant' && (
                  <Link
                    href="/restaurant/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Truck size={16} /> Manage Orders
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} /> Profile
                </Link>

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition cursor-pointer">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                pathname === item.href
                  ? 'bg-orange-50 text-orange-500'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          {status !== 'authenticated' && (
            <div className="mt-2 space-y-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-3 text-center bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
                  Login
                </button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full mt-2 px-4 py-3 text-center border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition">
                  Create Account
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}