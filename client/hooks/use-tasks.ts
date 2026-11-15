import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task/task.service';
import { UpdateTaskInput } from '@/types/task.types';
import { taskKeys } from '@/lib/react-query/task-keys';
import { commentService } from '@/services/task/comment.service';
import { CreateCommentSchema } from '@/schemas/comment.schema';
import { attachmentService } from '@/services/task/attachment.service';

type UseTaskParams = {
  page: number;
  limit?: number;
  status?: string;
  priority?: string;
  sort?: string;
};

export function useTasks({ page, limit = 10, status, priority, sort }: UseTaskParams) {
  return useQuery({
    queryKey: taskKeys.list({ page, limit, status, priority, sort }),
    queryFn: () => taskService.getTasks({ page, limit, status, priority, sort }),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) => taskService.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: CreateCommentSchema }) =>
      commentService.createComment(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, commentId, data }: { taskId: string; commentId: string; data: CreateCommentSchema }) =>
      commentService.updateComment(taskId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) =>
      commentService.deleteComment(taskId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
    },
  });
}

export function useAddAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, files }: { taskId: string; files: File[] }) =>
      attachmentService.addAttachment(taskId, files),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, attachmentId }: { taskId: string; attachmentId: string }) =>
      attachmentService.deleteAttachment(taskId, attachmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
    },
  });
}
