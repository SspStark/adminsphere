import RouteGuard from '@/components/auth/route-guard';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <RouteGuard mode="guest">
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </RouteGuard>
  );
}
