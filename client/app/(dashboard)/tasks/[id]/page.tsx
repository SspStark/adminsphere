import TaskDetails from '@/components/tasks/task-details';

type props = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailsPage({ params }: props) {
  const { id } = await params;
  return <TaskDetails id={id} />;
}
