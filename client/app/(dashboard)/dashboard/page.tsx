'use client';

import DashboardCard from '@/components/dashboard/dashboard-card';
import SectionHeader from '@/components/dashboard/section-header';
import { useDashboardStats } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { data: statsResponse, isLoading: statsLoading } = useDashboardStats();

  const stats = statsResponse?.data;
  const activities = stats?.recentActivity ?? [];

  if (statsLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" subtitle="Workspace Overview" />
      <div className="grid gap-4 mid:grid-cols-3">
        <DashboardCard title="Total Tasks" value={String(stats?.totalTasks ?? 0)} description="All active tasks" />

        <DashboardCard title="Pending" value={String(stats?.pendingTasks ?? 0)} description="Tasks waiting to start" />

        <DashboardCard title="In Progress" value={String(stats?.inProgressTasks ?? 0)} description="Currently active" />

        <DashboardCard title="Completed" value={String(stats?.completedTasks ?? 0)} description="Completed tasks" />

        <DashboardCard title="Active Users" value={String(stats?.activeUsers ?? 0)} description="Active accounts" />
      </div>
      <section>
        <h2 className="text-lg font-semibold">Recent Activity</h2>

        <div className="mt-4 space-y-3">
          {activities.map((activity) => (
            <div key={activity._id}>
              {activity.user.firstName} {activity.user.lastName} {activity.action.toLowerCase().replaceAll('_', ' ')}
              {activity.task && ` — ${activity.task.title}`}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
