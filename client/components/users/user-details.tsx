'use client';

import { useUser } from '@/hooks/use-users';
import DetailItem from './user-detail-item';
import UserAvatar from './user-avatar';

type UserDetailsProps = {
  id: string;
};

export default function UserDetails({ id }: UserDetailsProps) {
  const { data, isPending, isError } = useUser(id);

  if (isPending) {
    return <p>Loading user...</p>;
  }

  if (isError || !data?.user) {
    return <p>User not found.</p>;
  }

  const user = data.user;

  return (
    <div className="space-y-6 rounded-lg border border-white/10 p-6">
      <h2 className="text-2xl font-semibold">User Details</h2>

      <UserAvatar user={user} />

      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="First Name" value={user.firstName} />

        <DetailItem label="Last Name" value={user.lastName} />

        <DetailItem label="Username" value={user.username} />

        <DetailItem label="Email" value={user.email} />

        <DetailItem label="Role" value={user.role} />

        <DetailItem label="Status" value={user.isActive ? 'Active' : 'Inactive'} />

        <DetailItem label="Created" value={new Date(user.createdAt).toLocaleString()} />

        <DetailItem label="Updated" value={new Date(user.updatedAt).toLocaleString()} />
      </div>
    </div>
  );
}
