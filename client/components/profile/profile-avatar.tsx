'use client';

import { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import Button from '../ui/button';

import { useAuthStore } from '@/store/auth.store';
import { useDeleteMyAvatar, useUploadMyAvatar } from '@/hooks/use-users';
import { getErrorMessage } from '@/lib/get-error-message';

export default function ProfileAvatar() {
  const user = useAuthStore((state) => state.user);

  const uploadAvatar = useUploadMyAvatar();
  const deleteAvatar = useDeleteMyAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    uploadAvatar.mutate(file, {
      onSuccess: () => {
        toast.success('Profile image updated successfully');
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
      onSettled: () => {
        // Allow selecting the same file again
        event.target.value = '';
      },
    });
  };

  const handleDelete = () => {
    deleteAvatar.mutate(undefined, {
      onSuccess: () => {
        toast.success('Profile image removed successfully');
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const isUploading = uploadAvatar.isPending;
  const isDeleting = deleteAvatar.isPending;
  const isProcessing = isUploading || isDeleting;

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-2xl font-semibold">
        {user.profileImage?.url ? (
          <Image
            src={user.profileImage.url}
            alt={`${user.firstName} profile`}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="space-y-2">
        <div>
          <h2 className="text-lg font-medium">Profile Picture</h2>

          <p className="text-sm text-white/40">Upload a profile picture to personalize your account.</p>
        </div>

        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </Button>

          {user.profileImage?.url && (
            <Button type="button" onClick={handleDelete} disabled={isProcessing} className="bg-red-500 text-white">
              {isDeleting ? 'Removing...' : 'Remove'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
