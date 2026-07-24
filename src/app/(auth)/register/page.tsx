'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, Upload, X } from 'lucide-react'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { authAPI } from '@/lib/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

// ✅ Define the data type
interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address'
    }

    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number'
    }

    if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setAvatar(file)
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setAvatar(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData

      // ✅ Create data object with correct type
      const dataToSend: RegisterData = {
        name: registerData.name.trim(),
        email: registerData.email.trim().toLowerCase(),
        password: registerData.password,
      }

      // ✅ Add phone only if provided
      if (registerData.phone && registerData.phone.trim()) {
        dataToSend.phone = registerData.phone.trim()
      }

      console.log('📤 Sending registration data:', { 
        name: dataToSend.name,
        email: dataToSend.email,
        password: '******',
        phone: dataToSend.phone || 'Not provided'
      })

      const response = await authAPI.register(dataToSend)
      
      console.log('📥 Registration response:', response)

      if (response?.success) {
        toast.success('Registration successful! Please login.')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        const errorMsg = response?.message || response?.error || 'Registration failed'
        toast.error(errorMsg)
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error)
      
      let message = 'Registration failed. Please try again.'
      
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.response?.data?.error) {
        message = error.response.data.error
      } else if (error.message) {
        message = error.message
      }
      
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 transform transition duration-300 hover:scale-[1.02] border border-orange-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🍽️</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join our food delivery community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {avatarPreview ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500 shadow-md">
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors group"
                >
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500 mx-auto" />
                    <span className="text-xs text-gray-500 group-hover:text-orange-500">Upload</span>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Optional - Upload profile picture</p>
          </div>

          {/* Name */}
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.name}
            required
          />

          {/* Email */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email}
            required
          />

          {/* Phone */}
          <Input
            label="Phone Number (Optional)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            icon={<Phone className="h-5 w-5 text-gray-400" />}
            error={errors.phone}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password (min 6 chars, must contain number)"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="e.g., Pass@123456"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <Button type="submit" isLoading={isLoading} fullWidth>
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Social Login Buttons */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 
                 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 
                 transition-colors shadow-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <FcGoogle className="text-xl" /> Continue with Google
        </button>

        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 
                 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 
                 transition-colors shadow-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <FaGithub className="text-xl" />
          <span>Continue with GitHub</span>
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:text-orange-500 font-medium hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}