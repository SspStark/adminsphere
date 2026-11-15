'use client';

import { useDeleteUser, useUsers } from '@/hooks/use-users';
import Button from '../ui/button';
import UserTable from './user-table';
import { useState } from 'react';
import ConfirmationDialog from '../ui/confirmation-dialog';
import { User, AssignableUser } from '@/types/user.types';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/get-error-message';
import CreateUserDialog from './create-user-dialog';
import EditUserDialog from './edit-user-dialog';
import { isAssignableRole } from '@/constants/roles';

export default function UserList() {
  const { data, isPending, isError, isFetching } = useUsers();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AssignableUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const deleteUser = useDeleteUser();

  const onDeleteUser = () => {
    if (!deletingUser) return;

    deleteUser.mutate(deletingUser._id, {
      onSuccess: () => {
        toast.success('User deactivated successfully');
        setDeletingUser(null);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  if (isPending) {
    return <p>Loading users...</p>;
  }

  if (isError) {
    return <p>Failed to load users.</p>;
  }

  const handleEditUser = (user: User) => {
    if (!isAssignableRole(user.role)) {
      return;
    }

    setEditingUser(user as AssignableUser);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          Create User
        </Button>
        <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
      {isFetching && <p className="text-sm text-white/60">Refreshing...</p>}

      <UserTable users={data.users} actions={{ onEdit: handleEditUser, onDelete: setDeletingUser }} />

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
          }
        }}
      />

      <ConfirmationDialog
        open={!!deletingUser}
        title="Deactivate User"
        description={`Are you sure you want to Deactivate "${deletingUser?.username}"?`}
        confirmLabel="Deactivate"
        onOpenChange={(open) => {
          if (!open) {
            setDeletingUser(null);
          }
        }}
        onConfirm={onDeleteUser}
      />
    </div>
  );
}
