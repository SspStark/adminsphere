'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '../ui/input';
import Button from '../ui/button';
import { createUserSchema, CreateUserSchema } from '@/schemas/user.schema';
import { ROLES, ASSIGNABLE_ROLES } from '@/constants/roles';

type UserFormProps = {
  onSubmit: (data: CreateUserSchema) => void;
  isSubmitting?: boolean;
};

export default function CreateUserForm({ onSubmit, isSubmitting }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      role: ROLES.EMPLOYEE,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>First Name</label>

        <Input {...register('firstName')} className="w-full rounded border" />

        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
      </div>

      <div>
        <label>Last Name</label>

        <Input {...register('lastName')} className="w-full rounded border" />

        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
      </div>

      <div>
        <label>Email</label>

        <Input type="email" {...register('email')} className="w-full rounded border" />

        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label>Username</label>

        <Input autoComplete="off" {...register('username')} className="w-full rounded border" />

        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
      </div>

      <div>
        <label>Password</label>

        <Input
          autoComplete="new-password"
          type="password"
          {...register('password')}
          className="w-full rounded border"
        />

        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label>Role</label>

        <select {...register('role')} className="w-70 rounded border p-2">
          {ASSIGNABLE_ROLES.map((role) => (
            <option key={role} value={role} className="bg-white text-black">
              {role}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="rounded bg-blue-600 text-white">
        {isSubmitting ? 'Saving...' : 'Create'}
      </Button>
    </form>
  );
}
