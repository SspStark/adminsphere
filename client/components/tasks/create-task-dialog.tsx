'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import TaskForm from './task-form';
import { useCreateTask } from '@/hooks/use-tasks';
import { CreateTaskSchema } from '@/schemas/task.schema';

type CreateTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const createTask = useCreateTask();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold">Create Task</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400">
            Fill in the details below to create a new task.
          </Dialog.Description>

          <TaskForm
            submitLabel="Create"
            isSubmitting={createTask.isPending}
            onSubmit={(data) => {
              const payload: CreateTaskSchema = {
                ...data,
                assignedTo: data.assignedTo || undefined,
              };
              createTask.mutate(payload, {
                onSuccess: () => {
                  toast.success('Task created successfully');
                  onOpenChange(false);
                },
                onError: (error) => {
                  toast.error(error instanceof Error ? error.message : 'Failed to create task');
                },
              });
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
