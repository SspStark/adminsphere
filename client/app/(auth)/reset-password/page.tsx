import ResetPasswordForm from '@/components/auth/reset-password-form';
import Link from 'next/link';

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <h1 className="text-3xl font-bold">Reset Password</h1>

      <p className="mt-2 text-sm text-white/60">Enter your new password below.</p>

      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-red-400">Invalid or missing password reset token.</p>

          <Link href="/forgot-password" className="block text-center text-sm text-white/60 transition hover:text-white">
            Request a new reset link
          </Link>
        </div>
      )}
    </div>
  );
}
