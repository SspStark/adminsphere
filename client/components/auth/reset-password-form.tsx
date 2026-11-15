'use client';

import { getErrorMessage } from '@/lib/get-error-message';
import { resetPasswordSchema, ResetPasswordSchema } from '@/schemas/auth.schema';
import { authService } from '@/services/auth/auth.service';
import Input from '../ui/input';
import Button from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,

    onSuccess: (data) => {
      setMessage(data.message);

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    },

    onError: (error) => {
      setMessage(getErrorMessage(error));
    },
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    setMessage('');
    resetPasswordMutation.mutate({
      token,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <Input
          type="password"
          placeholder="New password"
          {...register('newPassword')}
          className="w-full"
          disabled={resetPasswordMutation.isPending}
        />

        {errors.newPassword && <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>}
      </div>

      <div>
        <Input
          type="password"
          placeholder="Confirm new password"
          {...register('confirmPassword')}
          className="w-full"
          disabled={resetPasswordMutation.isPending}
        />

        {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" disabled={resetPasswordMutation.isPending} className="w-full">
        {resetPasswordMutation.isPending ? 'Resetting Password...' : 'Reset Password'}
      </Button>

      {message && <p className="text-sm text-white/70">{message}</p>}

      <p className="text-center text-sm text-white/60">
        <Link href="/login" className="text-white transition hover:opacity-80">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
