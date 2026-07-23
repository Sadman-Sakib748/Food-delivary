'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Settings,
  User,
  Home
} from 'lucide-react'
import { cn } from '@/lib/api/utils'

interface SidebarItem {
  title: string
  href: string
  icon: ReactNode
  badge?: number
  children?: SidebarItem[]
}

interface SidebarProps {
  items: SidebarItem[]
  title: string
  subtitle: string
  icon: string
  role: string
  children?: ReactNode
}

export default function Sidebar({ items, title, subtitle, icon, role, children }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname.startsWith(href)
  }

  const isChildActive = (children: SidebarItem[]) => {
    return children.some(child => isActive(child.href))
  }

  const renderItems = (items: SidebarItem[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0
      const isExpanded = expandedItems.includes(item.href)
      const active = isActive(item.href) || (hasChildren && isChildActive(item.children!))

      return (
        <div key={item.href}>
          {hasChildren ? (
            <div>
              <button
                onClick={() => toggleExpand(item.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  active
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight 
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isExpanded && 'rotate-90'
                      )} 
                    />
                  </>
                )}
              </button>
              {!collapsed && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {renderItems(item.children!, level + 1)}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                active
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )}
        </div>
      )
    })
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-20' : 'w-64',
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            'flex items-center border-b border-gray-200 transition-all',
            collapsed ? 'justify-center p-4' : 'gap-3 p-6'
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{icon}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
                <p className="text-xs text-gray-500 truncate">{subtitle}</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center p-2 m-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {renderItems(items)}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-200 p-4">
            {!collapsed ? (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                  {session?.user?.name?.charAt(0) || role.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500 truncate">{session?.user?.email || 'user@email.com'}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-medium">
                  {session?.user?.name?.charAt(0) || role.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            
            <Link
              href={`/${role}/profile`}
              className={cn(
                'flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors',
                collapsed && 'justify-center'
              )}
            >
              <User className="w-4 h-4" />
              {!collapsed && <span>Profile</span>}
            </Link>
            
            <Link
              href={`/${role}/settings`}
              className={cn(
                'flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors',
                collapsed && 'justify-center'
              )}
            >
              <Settings className="w-4 h-4" />
              {!collapsed && <span>Settings</span>}
            </Link>

            <button
              onClick={() => signOut()}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'transition-all duration-300',
        collapsed ? 'lg:ml-20' : 'lg:ml-64'
      )}>
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </>
  )
}