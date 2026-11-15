'use client';

import { User, UserActions } from '../../types/user.types';
import UserRow from './user-row';

type UserTableProps = {
  users: User[];
  actions: UserActions;
};

export default function UserTable({ users, actions }: UserTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Username</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Role</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user._id} user={user} actions={actions} />
        ))}
      </tbody>
    </table>
  );
}
