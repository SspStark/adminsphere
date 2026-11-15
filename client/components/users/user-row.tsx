'use client';

import Link from 'next/link';

import { User, UserActions } from '@/types/user.types';
import Button from '../ui/button';
import { ROLES } from '@/constants/roles';

type UserRowProps = {
  user: User;
  actions: UserActions;
};

export default function UserRow({ user, actions }: UserRowProps) {
  const isSuperAdmin = user.role === ROLES.SUPER_ADMIN;
  return (
    <tr className="border-b border-white/10">
      <td className="p-3">
        {user.firstName} {user.lastName}
      </td>
      <td className="p-3">{user.username}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">
        <div className="flex gap-2">
          {!isSuperAdmin && (
            <>
              <Button type="button" onClick={() => actions.onEdit?.(user)} className="rounded px-2 h-9">
                Edit
              </Button>

              <Button type="button" onClick={() => actions.onDelete?.(user)} className="rounded px-2 h-9">
                Delete
              </Button>
            </>
          )}
          <Link
            href={`/users/${user._id}`}
            className="inline-flex h-9 items-center rounded bg-white px-2 text-sm font-medium text-black transition hover:opacity-90"
          >
            View
          </Link>
        </div>
      </td>
    </tr>
  );
}
