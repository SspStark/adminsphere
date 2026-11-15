'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import Button from '../ui/button';
import { User } from '@/types/user.types';
import { useDeleteAvatar, useUploadAvatar } from '@/hooks/use-users';
import { getErrorMessage } from '@/lib/get-error-message';
import ConfirmationDialog from '../ui/confirmation-dialog';

type UserAvatarProps = {
  user: User;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG or WEBP image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }

    uploadAvatar.mutate(
      { id: user._id, file },
      {
        onSuccess: () => {
          toast.success('Avatar updated.');
        },
        onError: (error: Error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );

    e.target.value = '';
  }

  function handleDelete() {
    deleteAvatar.mutate(user._id, {
      onSuccess: () => {
        toast.success('Avatar removed.');
        setDeleteDialogOpen(false);
      },
      onError: (error: Error) => {
        toast.error(getErrorMessage(error));
      },
    });
  }

  return (
    <div className="flex items-center gap-6 border-b border-white/10 pb-6">
      {user.profileImage?.url ? (
        <Image
          src={user.profileImage.url}
          alt={`${user.firstName} ${user.lastName}`}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-700 text-3xl font-semibold">
          {initials}
        </div>
      )}

      <div className="flex flex-1 items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>

          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadAvatar.isPending}>
            Upload
          </Button>

          {user.profileImage?.url && (
            <Button
              type="button"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleteAvatar.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          )}

          <ConfirmationDialog
            open={isDeleteDialogOpen}
            title="Delete Avatar"
            description="Are you sure you want to remove the profile image?"
            confirmLabel="Delete"
            onOpenChange={(open) => {
              if (!open) {
                setDeleteDialogOpen(false);
              }
            }}
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
