'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

import Input from '../ui/input';
import Button from '../ui/button';

import { loginSchema, LoginSchema } from '@/schemas/auth.schema';
import { getErrorMessage } from '@/lib/get-error-message';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import { AUTH_ERROR_MESSAGES, isAuthErrorCode } from '@/lib/auth-errors';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const [loginError, setLoginError] = useState('');

  const router = useRouter();
  const setUser = useAuthStore((store) => store.setUser);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [oauthError] = useState(() => {
    if (error && isAuthErrorCode(error)) {
      return AUTH_ERROR_MESSAGES[error];
    }

    return '';
  });

  const displayedError = loginError || oauthError;

  useEffect(() => {
    if (!error) return;

    router.replace('/login');
  }, [error, router]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      router.push('/dashboard');
    },
    onError: (error) => {
      setLoginError(getErrorMessage(error));
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoginError('');
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <Input type="text" placeholder="Username or Email" {...register('identifier')} className="w-full" />
        {errors.identifier && <p className="mt-1 text-sm text-red-400">{errors.identifier.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="password" {...register('password')} className="w-full" />
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}

        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-sm text-white/60 transition hover:text-white">
            Forgot Password?
          </Link>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || loginMutation.isPending}
        className="w-full bg-blue-800 text-white"
      >
        {loginMutation.isPending ? 'Signing In' : 'Sign In'}
      </Button>
      {displayedError && <p className="text-sm text-red-400">{displayedError}</p>}
      <Button
        type="button"
        className="w-full bg-transparent text-white border"
        onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.AUTH.OAUTH}`)}
      >
        Continue with Google
      </Button>
    </form>
  );
}
