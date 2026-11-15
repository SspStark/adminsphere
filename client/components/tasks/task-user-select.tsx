'use client';

import { toast } from 'sonner';

import { useUpdateTask } from '@/hooks/use-tasks';
import { useUsers } from '@/hooks/use-users';
import { getErrorMessage } from '@/lib/get-error-message';
import { Task } from '@/types/task.types';
import { User } from '@/types/user.types';
import { ROLES } from '@/constants/roles';

type TaskUserSelectProps = {
  taskId: string;
  assignedTo: Task['assignedTo'];
};

export default function TaskUserSelect({ taskId, assignedTo }: TaskUserSelectProps) {
  const { data, isPending } = useUsers();
  const updateTask = useUpdateTask();

  const users = data?.users.filter((user) => user.role === ROLES.EMPLOYEE);

  const getFullname = (user: User) => [user.firstName, user.lastName].filter(Boolean).join(' ');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === assignedTo?._id) return;

    updateTask.mutate(
      { id: taskId, data: { assignedTo: value || null } },
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
      aria-label="Assign user"
      value={assignedTo?._id || ''}
      onChange={handleChange}
      className="px-1 py-1 text-sm"
      disabled={isPending}
    >
      <option value="" className="bg-white text-black">
        Unassigned
      </option>
      {users?.map((user) => (
        <option key={user._id} value={user._id} className="bg-white text-black">
          {getFullname(user)}
        </option>
      ))}
    </select>
  );
}
