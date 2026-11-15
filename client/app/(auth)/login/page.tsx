import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <h1 className="text-3xl font-bold">Welcome Back</h1>

      <p className="mt-2 text-sm text-white/60">Sign in to continue to AdminSphere</p>

      <LoginForm />
    </div>
  );
}
