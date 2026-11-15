'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import Input from '../ui/input';
import Button from '../ui/button';

import { changeMyPasswordSchema, ChangeMyPasswordSchema } from '@/schemas/user.schema';

import { useChangeMyPassword } from '@/hooks/use-users';
import { getErrorMessage } from '@/lib/get-error-message';

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const changePassword = useChangeMyPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeMyPasswordSchema>({
    resolver: zodResolver(changeMyPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangeMyPasswordSchema) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('Password changed successfully');

          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleOpenChange = (value: boolean) => {
    if (!value && !changePassword.isPending) {
      reset();
    }

    onOpenChange(value);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold">Change Password</Dialog.Title>

          <Dialog.Description className="mt-1 text-sm text-gray-400">
            Enter your current password and choose a new password.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Current Password</label>

              <Input
                type="password"
                autoComplete="current-password"
                {...register('currentPassword')}
                className="w-full"
              />

              {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>

              <Input type="password" autoComplete="new-password" {...register('newPassword')} className="w-full" />

              {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Confirm New Password</label>

              <Input type="password" autoComplete="new-password" {...register('confirmPassword')} className="w-full" />

              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <Button type="button" className="bg-white/10 text-white" disabled={changePassword.isPending}>
                  Cancel
                </Button>
              </Dialog.Close>

              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
