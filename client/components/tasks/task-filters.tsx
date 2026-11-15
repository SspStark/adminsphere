import { TASK_STATUS } from '@/constants/task';

type TaskFiltersProps = {
  status: string;
  priority: string;
  sort: string;

  onStatusChange: (value: string) => void;

  onPriorityChange: (value: string) => void;

  onSortChange: (value: string) => void;
};

export default function TaskFilters({
  status,
  priority,
  sort,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex gap-4">
      <select title="Filter by status" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All Status</option>
        {TASK_STATUS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select title="Filter by priority" value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
        <option value="">All Priority</option>

        <option value="high">High</option>

        <option value="medium">Medium</option>

        <option value="low">Low</option>
      </select>

      <select title="Sort tasks" value={sort} onChange={(e) => onSortChange(e.target.value)}>
        <option value="-createdAt">Newest</option>

        <option value="createdAt">Oldest</option>
      </select>
    </div>
  );
}
