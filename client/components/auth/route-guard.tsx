'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/use-auth';

type RouteGuardProps = {
  children: React.ReactNode;
  mode?: 'auth' | 'guest';
  permission?: string;
};

export default function RouteGuard({ children, mode = 'auth', permission }: RouteGuardProps) {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (mode === 'auth' && !user) {
      router.replace('/login');
    }

    if (mode === 'guest' && user) {
      router.replace('/dashboard');
    }

    if (mode === 'auth' && user && permission && !user.permissions.includes(permission)) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, mode, permission, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (mode === 'auth' && !user) {
    return null;
  }

  if (mode === 'guest' && user) {
    return null;
  }

  return children;
}
