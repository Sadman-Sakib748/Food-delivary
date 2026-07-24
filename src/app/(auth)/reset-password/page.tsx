import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ResetPasswordForm from '@/components/shared/ResetPasswordForm';


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}