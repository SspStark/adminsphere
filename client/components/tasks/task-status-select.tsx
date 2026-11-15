'use client';

import { toast } from 'sonner';

import { TASK_STATUS, TaskStatus } from '@/constants/task';
import { useUpdateTask } from '@/hooks/use-tasks';
import { getErrorMessage } from '@/lib/get-error-message';

type TaskStatusSelectProps = {
  taskId: string;
  status: TaskStatus;
};

export default function TaskStatusSelect({ taskId, status }: TaskStatusSelectProps) {
  const updateTask = useUpdateTask();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as TaskStatus;

    if (nextStatus === status) {
      return;
    }

    updateTask.mutate(
      { id: taskId, data: { status: nextStatus } },
      {
        onSuccess: () => {
          toast.success('Task status updated');
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  return (
    <select
      aria-label="Task status"
      value={status}
      onChange={handleChange}
      disabled={updateTask.isPending}
      className="px-1 py-1 text-sm"
    >
      {TASK_STATUS.map((value) => (
        <option key={value} value={value} className="bg-white text-black">
          {value}
        </option>
      ))}
    </select>
  );
}
