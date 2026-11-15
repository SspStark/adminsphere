import { Task, TaskActions } from '@/types/task.types';
import TaskRow from './task-row';

type TaskTableProps = {
  tasks: Task[];
  actions: TaskActions;
};

export default function TaskTable({ tasks, actions }: TaskTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Priority</th>
          <th className="p-3 text-left">Assigned To</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => (
          <TaskRow key={task._id} task={task} actions={actions} />
        ))}
      </tbody>
    </table>
  );
}
