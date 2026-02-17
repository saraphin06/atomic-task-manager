import type { Task } from '../../../types/task.ts';
import { TaskRow } from './TaskRow.tsx';

interface TaskTableProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskTable({ tasks, onToggle, onDelete }: TaskTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th scope="col" className="w-10 px-4 py-3 text-sm font-medium text-gray-500">
              <span className="sr-only">Status</span>
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-medium text-gray-500">Title</th>
            <th scope="col" className="px-4 py-3 text-sm font-medium text-gray-500">Due Date</th>
            <th scope="col" className="px-4 py-3 text-sm font-medium text-gray-500">Assigned To</th>
            <th scope="col" className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
            <th scope="col" className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
