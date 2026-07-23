import { ReactNode } from 'react'
import Link from 'next/link'

import Button from '@/components/ui/Button'
import { cn } from '@/lib/api/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      'text-center py-12 px-4',
      className
    )}>
      {icon && (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <Link href={action.href}>
          <Button className="mt-6">{action.label}</Button>
        </Link>
      )}
    </div>
  )
}