import { useAuthStore } from '@/store/auth.store';

export const hasPermission = (permission: string) => {
  const user = useAuthStore.getState().user;
  return user?.permissions.includes(permission) ?? false;
};
