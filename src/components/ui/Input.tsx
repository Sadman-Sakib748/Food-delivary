'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/api/utils'


interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
  showPasswordToggle?: boolean
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    icon, 
    helperText,
    showPasswordToggle = false,
    type = 'text',
    variant = 'default',
    inputSize = 'md',
    required = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    
    // Determine input type based on password toggle
    const getInputType = () => {
      if (showPasswordToggle && type === 'password') {
        return showPassword ? 'text' : 'password'
      }
      return type
    }

    const inputType = getInputType()

    // Variant styles
    const variantStyles = {
      default: 'bg-white border-gray-300 hover:border-gray-400',
      filled: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      outline: 'bg-transparent border-2 border-gray-300 hover:border-gray-400',
    }

    // Size styles
    const sizeStyles = {
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    }

    // Determine if password toggle should be shown
    const shouldShowToggle = showPasswordToggle && type === 'password'

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            required={required}
            className={cn(
              'block w-full rounded-lg transition-all duration-200 outline-none',
              variantStyles[variant],
              sizeStyles[inputSize],
              icon && 'pl-10',
              shouldShowToggle && 'pr-10',
              error ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
              className
            )}
            {...props}
          />
          {shouldShowToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input