import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="space-y-3">
          <Link href="/">
            <Button fullWidth>Go to Home</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" fullWidth>Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}