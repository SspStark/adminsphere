'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import { CreateTaskSchema, createTaskSchema } from '@/schemas/task.schema';
import Button from '../ui/button';
import Input from '../ui/input';
import Textarea from '../ui/textarea';
import { useUsers } from '@/hooks/use-users';
import { User } from '@/types/user.types';
import { ROLES } from '@/constants/roles';

type TaskFormProps = {
  mode?: 'create' | 'edit';
  onSubmit: (data: CreateTaskSchema) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateTaskSchema>;
  submitLabel?: string;
};

export default function TaskForm({ onSubmit, isSubmitting, defaultValues, submitLabel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: '',
      ...defaultValues,
    },
  });

  const { data } = useUsers();
  const users = data?.users.filter((user) => user.role === ROLES.EMPLOYEE);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const getFullname = (user: User) => [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Title</label>

        <Input {...register('title')} className="w-full rounded border" />

        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label>Description</label>

        <Textarea {...register('description')} />
      </div>

      <div className="flex flex-col gap-1">
        <label>Priority</label>

        <select {...register('priority')} className="w-70 rounded border px-3 py-2">
          <option className="bg-white text-black" value="low">
            Low
          </option>
          <option className="bg-white text-black" value="medium">
            Medium
          </option>
          <option className="bg-white text-black" value="high">
            High
          </option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label>Due Date</label>

        <Input type="date" {...register('dueDate')} className="w-70" />
        {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label>Assigned To</label>

        <select {...register('assignedTo')} className="w-70 rounded border p-2">
          <option value="" className="bg-white text-black">
            Unassigned
          </option>
          {users?.map((user) => (
            <option key={user._id} value={user._id} className="bg-white text-black">
              {getFullname(user)}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="rounded bg-blue-600 text-white">
        {isSubmitting ? 'Saving...' : (submitLabel ?? 'submit')}
      </Button>
    </form>
  );
}
