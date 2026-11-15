import { cn } from '@/lib/utils';
import { TaskPriority } from '@/constants/task';

type PriorityBadgeProps = {
  priority: TaskPriority;
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-1 text-xs font-medium',
        priority === 'high' && 'bg-red-500/20',
        priority === 'medium' && 'bg-orange-500/20',
        priority === 'low' && 'bg-green-500/20'
      )}
    >
      {priority}
    </span>
  );
}
