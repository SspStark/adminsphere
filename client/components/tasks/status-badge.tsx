import { cn } from '@/lib/utils';
import { TaskStatus } from '@/constants/task';

type StatusBadgeProps = {
  status: TaskStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-1 text-xs font-medium',
        status === 'completed' && 'bg-green-500/20',
        status === 'in-progress' && 'bg-blue-500/20',
        status === 'pending' && 'bg-yellow-500/20'
      )}
    >
      {status}
    </span>
  );
}
