import SectionHeader from '@/components/dashboard/section-header';
import UserList from '@/components/users/user-list';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Users" subtitle="Manage all users" />

      <UserList />
    </div>
  );
}
