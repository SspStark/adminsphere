import { userKeys } from '@/lib/react-query/user-keys';
import { UpdateUserSchema } from '@/schemas/user.schema';
import { userService } from '@/services/user/user.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: userService.getUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserSchema }) => userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => userService.uploadAvatar(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteAvatar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
      });
    },
  });
}

// self

export function useUpdateMe() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userService.updateMe,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: userService.changeMyPassword,
  });
}

export function useUploadMyAvatar() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userService.uploadMyAvatar,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}

export function useDeleteMyAvatar() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userService.deleteMyAvatar,
    onSuccess: (data) => {
      setUser(data.user);
    },
  });
}
