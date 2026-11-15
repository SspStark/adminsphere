'use client';

import { useState } from 'react';

import { useTasks, useDeleteTask } from '@/hooks/use-tasks';
import TaskFilters from './task-filters';
import TaskTable from './task-table';
import Pagination from '@/components/ui/pagination';
import CreateTaskDialog from './create-task-dialog';
import EditTaskDialog from './edit-task-dialog';
import Button from '../ui/button';
import { Task } from '@/types/task.types';
import ConfirmationDialog from '../ui/confirmation-dialog';
import { toast } from 'sonner';
import { hasPermission } from '@/lib/authorization';
import { PERMISSIONS } from '@/constants/permissions';

export default function TaskList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { data, isPending, isError, isFetching } = useTasks({
    page,
    status,
    priority,
    sort,
  });

  const deleteTask = useDeleteTask();

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const onDeleteTask = () => {
    if (!deletingTask) return;

    deleteTask.mutate(deletingTask._id, {
      onSuccess: () => {
        toast.success('Task deleted successfully');
        setDeletingTask(null);
      },
      onError: () => {
        toast.error('Failed to delete task');
      },
    });
  };

  if (isPending) {
    return <p>Loading tasks...</p>;
  }

  if (isError) {
    return <p>Failed to load tasks.</p>;
  }

  return (
    <div className="space-y-4">
      {hasPermission(PERMISSIONS.TASK.CREATE) && (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setIsCreateOpen(true)} className="rounded-md">
            Create Task
          </Button>
          <CreateTaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
      )}
      <TaskFilters
        status={status}
        priority={priority}
        sort={sort}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onSortChange={handleSortChange}
      />

      {isFetching && <p className="text-sm text-white/60">Refreshing...</p>}

      <TaskTable tasks={data?.data ?? []} actions={{ onEdit: setEditingTask, onDelete: setDeletingTask }} />

      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTask(null);
          }
        }}
      />

      <ConfirmationDialog
        open={!!deletingTask}
        title="Delete Task"
        description={`Are you sure you want to delete "${deletingTask?.title}"?`}
        confirmLabel="Delete"
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTask(null);
          }
        }}
        onConfirm={onDeleteTask}
      />

      <Pagination page={page} totalPages={data?.pages ?? 1} onPageChange={setPage} />
    </div>
  );
}
