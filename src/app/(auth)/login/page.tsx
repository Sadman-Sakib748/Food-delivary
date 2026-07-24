'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import OtpModal from '@/components/OtpModal'


export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState('')

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = session.user.role || 'customer'
      router.push(`/${role}`)
    }
  }, [status, session, router])

  const handleDemoUser = (data: { email: string; password: string }) => {
    setEmail(data.email)
    setPassword(data.password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error === 'OTP_REQUIRED') {
        setEmailForOtp(email)
        setShowOtp(true)
        setIsLoading(false)
        return
      }

      if (result?.error) {
        toast.error(result.error || 'Invalid email or password')
      } else {
        toast.success('Login successful!')
        setTimeout(() => {
          if (session?.user?.role) {
            router.push(`/${session.user.role}`)
          } else {
            router.push(callbackUrl)
          }
        }, 500)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-orange-100">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🍽️</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  required
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Demo Users */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleDemoUser({
                  email: "demo-admin-1@fastfeast.com",
                  password: "demo-admin-1",
                })}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs py-1.5 px-3 rounded-full transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoUser({
                  email: "demo-moderator-1@fastfeast.com",
                  password: "demo-moderator-1",
                })}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs py-1.5 px-3 rounded-full transition-colors"
              >
                Moderator
              </button>
              <button
                type="button"
                onClick={() => handleDemoUser({
                  email: "demo-restaurantOwner-3@fastfeast.com",
                  password: "demo-restaurantOwner-3",
                })}
                className="bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs py-1.5 px-3 rounded-full transition-colors"
              >
                Restaurant
              </button>
              <button
                type="button"
                onClick={() => handleDemoUser({
                  email: "demo-rider-2@fastfeast.com",
                  password: "demo-rider-2",
                })}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs py-1.5 px-3 rounded-full transition-colors"
              >
                Rider
              </button>
              <button
                type="button"
                onClick={() => handleDemoUser({
                  email: "demo-user-3@fastfeast.com",
                  password: "demo-user-3",
                })}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-1.5 px-3 rounded-full transition-colors"
              >
                User
              </button>
            </div>

            <Button type="submit" isLoading={isLoading} fullWidth>
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm font-medium text-gray-700"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm font-medium text-gray-700"
          >
            <FaGithub className="text-xl" />
            <span>Continue with GitHub</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
              Sign up now
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtp && (
        <OtpModal email={emailForOtp} onClose={() => setShowOtp(false)} />
      )}
    </>
  )
}