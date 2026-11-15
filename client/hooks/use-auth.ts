import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
    enabled: !user,
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return { user: user ?? query.data ?? null, ...query };
}
