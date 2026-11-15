import Link from 'next/link';

import { Task, TaskActions } from '@/types/task.types';
import PriorityBadge from './priority-badge';
import Button from '../ui/button';
import TaskStatusSelect from './task-status-select';
import TaskUserSelect from './task-user-select';
import { hasPermission } from '@/lib/authorization';
import { PERMISSIONS } from '@/constants/permissions';

type TaskRowProps = {
  task: Task;
  actions: TaskActions;
};

export default function TaskRow({ task, actions }: TaskRowProps) {
  return (
    <tr className="border-b border-white/10">
      <td className="p-3">{task.title}</td>
      <td className="p-3">
        <TaskStatusSelect taskId={task._id} status={task.status} />
      </td>
      <td className="p-3">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="p-3">
        {hasPermission(PERMISSIONS.TASK.ASSIGN) ? (
          <TaskUserSelect taskId={task._id} assignedTo={task.assignedTo} />
        ) : task.assignedTo?.firstName ? (
          `${task.assignedTo.firstName} ${task.assignedTo.lastName || ''}`.trim()
        ) : null}
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          {hasPermission(PERMISSIONS.TASK.UPDATE) && (
            <Button type="button" onClick={() => actions.onEdit?.(task)} className="rounded px-2 h-9">
              Edit
            </Button>
          )}
          {hasPermission(PERMISSIONS.TASK.DELETE) && (
            <Button type="button" onClick={() => actions.onDelete?.(task)} className="rounded px-2 h-9">
              Delete
            </Button>
          )}
          <Link
            href={`/tasks/${task._id}`}
            className="inline-flex h-9 items-center rounded bg-white px-2 text-sm font-medium text-black transition hover:opacity-90"
          >
            View
          </Link>
        </div>
      </td>
    </tr>
  );
}
