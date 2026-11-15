import SectionHeader from '@/components/dashboard/section-header';
import TaskList from '@/components/tasks/task-list';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Tasks" subtitle="Manage all tasks" />

      <TaskList />
    </div>
  );
}
