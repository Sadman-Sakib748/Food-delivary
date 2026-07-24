"use client"
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LoginForm from '@/components/shared/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}