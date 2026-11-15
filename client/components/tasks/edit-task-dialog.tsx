'use client';

import * as Dialog from '@radix-ui/react-dialog';

import TaskForm from './task-form';
import { useUpdateTask } from '@/hooks/use-tasks';
import { Task, UpdateTaskInput } from '@/types/task.types';
import { toast } from 'sonner';

type EditTaskDialogProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const updateTask = useUpdateTask();

  if (!task) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 p-6 shadow-xl">
          <Dialog.Title>Edit Task</Dialog.Title>
          <Dialog.Description className="sr-only">Update the selected task.</Dialog.Description>

          <TaskForm
            submitLabel="Update"
            isSubmitting={updateTask.isPending}
            defaultValues={{
              title: task.title,
              description: task.description ?? '',
              priority: task.priority,
              dueDate: task.dueDate?.split('T')[0] ?? '',
              assignedTo: task.assignedTo?._id ?? '',
            }}
            onSubmit={(data) => {
              const payload: UpdateTaskInput = {
                ...data,
                assignedTo: data.assignedTo || null,
              };
              updateTask.mutate(
                { id: task._id, data: payload },
                {
                  onSuccess: () => {
                    toast.success('Task updated successfully');
                    onOpenChange(false);
                  },
                  onError: () => {
                    toast.error('Failed to update task');
                  },
                }
              );
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
