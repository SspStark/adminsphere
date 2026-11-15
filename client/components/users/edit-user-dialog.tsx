'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/use-users';
import { AssignableUser } from '@/types/user.types';
import EditUserForm from './edit-user-form';
import { getErrorMessage } from '@/lib/get-error-message';

type EditUserDialogPops = {
  user: AssignableUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditUserDialog({ user, open, onOpenChange }: EditUserDialogPops) {
  const updateUser = useUpdateUser();

  if (!user) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 p-6 shadow-xl">
          <Dialog.Title>Edit User</Dialog.Title>
          <Dialog.Description className="sr-only">Update the selected user.</Dialog.Description>
          <EditUserForm
            isSubmitting={updateUser.isPending}
            defaultValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              email: user.email,
              role: user.role,
            }}
            onSubmit={(data) => {
              updateUser.mutate(
                { id: user._id, data },
                {
                  onSuccess: () => {
                    toast.success('User updated successfully');
                    onOpenChange(false);
                  },
                  onError: (error) => {
                    toast.error(getErrorMessage(error));
                  },
                }
              );
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
