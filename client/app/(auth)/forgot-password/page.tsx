import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <h1 className="text-3xl font-bold">Forgot Password?</h1>

      <p className="mt-2 text-sm text-white/60">Enter your email and we&apos;ll send you a password reset link.</p>

      <ForgotPasswordForm />

      <p className="mt-4 text-center text-sm text-white/60">
        Remember your password?{' '}
        <Link href="/login" className="text-white transition hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  );
}
