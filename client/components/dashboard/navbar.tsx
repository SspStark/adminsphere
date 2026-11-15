'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Button from '../ui/button';

import { authService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/store/auth.store';
import NotificationBell from '@/components/notifications/notification-bell';

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      setUser(null);

      await queryClient.removeQueries({
        queryKey: ['me'],
      });

      router.replace('/login');
    },
  });

  return (
    <header className="w-full h-16 border-b border-white/10 px-6 flex items-center justify-between">
      <div onClick={() => router.push('/profile')} className="flex cursor-pointer items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 text-sm font-medium">
          {user?.profileImage?.url ? (
            <Image
              src={user.profileImage.url}
              alt={`${user.firstName} profile`}
              width={36}
              height={36}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()
          )}
        </div>

        <span>Welcome, {user?.firstName}</span>
      </div>
      <div className="flex items-center justify-center">
        <Button onClick={() => logoutMutation.mutate()}>
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
        <NotificationBell />
      </div>
    </header>
  );
}
