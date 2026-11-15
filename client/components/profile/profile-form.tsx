'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import Input from '../ui/input';
import Button from '../ui/button';

import { updateMeSchema, UpdateMeSchema } from '@/schemas/user.schema';
import { useAuthStore } from '@/store/auth.store';
import { useUpdateMe } from '@/hooks/use-users';
import { getErrorMessage } from '@/lib/get-error-message';

export default function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const updateMe = useUpdateMe();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateMeSchema>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      username: user?.username ?? '',
    },
  });

  const onSubmit = (data: UpdateMeSchema) => {
    updateMe.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">First Name</label>

        <Input {...register('firstName')} className="w-full" />

        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Last Name</label>

        <Input {...register('lastName')} className="w-full" />

        {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Username</label>

        <Input autoComplete="off" {...register('username')} className="w-full" />

        {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>

        <Input type="email" value={user.email} disabled className="w-full cursor-not-allowed opacity-60" />

        <p className="mt-1 text-xs text-white/40">Email cannot be changed.</p>
      </div>

      <Button type="submit" disabled={updateMe.isPending}>
        {updateMe.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
