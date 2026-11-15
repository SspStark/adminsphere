'use client';

import { useAuthStore } from '@/store/auth.store';
import ProfileForm from '@/components/profile/profile-form';
import ProfileAvatar from '@/components/profile/profile-avatar';
import SecuritySection from '@/components/profile/security-section';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-white/50">Manage your personal information and account settings.</p>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-6">
          <ProfileAvatar />
        </div>

        <h2 className="mb-4 text-lg font-medium">Personal Information</h2>

        <ProfileForm />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-medium">Account</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-white/40">Role</p>
            <p className="mt-1">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-white/40">Status</p>
            <p className="mt-1">{user.isActive ? 'Active' : 'Inactive'}</p>
          </div>

          <div>
            <p className="text-sm text-white/40">Member since</p>
            <p className="mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </section>
      <SecuritySection />
    </div>
  );
}
