'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { useCreateUser } from '@/hooks/use-users';
import CreateUserForm from './create-user-form';
import { getErrorMessage } from '@/lib/get-error-message';

type CreateUserDialogPops = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateUserDialog({ open, onOpenChange }: CreateUserDialogPops) {
  const createUser = useCreateUser();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold">Create User</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400">
            Fill in the details below to create a new user.
          </Dialog.Description>
          <CreateUserForm
            isSubmitting={createUser.isPending}
            onSubmit={(data) => {
              createUser.mutate(data, {
                onSuccess: () => {
                  toast.success('User created successfully');
                  onOpenChange(false);
                },
                onError: (error) => {
                  toast.error(getErrorMessage(error));
                },
              });
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
