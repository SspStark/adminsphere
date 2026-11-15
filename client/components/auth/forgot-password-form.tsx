'use client';

import { getErrorMessage } from '@/lib/get-error-message';
import { forgotPasswordSchema, ForgotPasswordSchema } from '@/schemas/auth.schema';
import { authService } from '@/services/auth/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/input';
import Button from '../ui/button';

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,

    onSuccess: (data) => {
      setMessage(data.message);
    },

    onError: (error) => {
      setMessage(getErrorMessage(error));
    },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    setMessage('');
    forgotPasswordMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full"
          disabled={forgotPasswordMutation.isPending}
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={forgotPasswordMutation.isPending} className="w-full">
        {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
      </Button>
      {message && <p className="text-sm text-white/70">{message}</p>}
    </form>
  );
}
