import { Link } from 'react-router-dom';
import type { Task } from '../../../types/task.ts';
import { formatDate } from '../../../utils/formatDate.ts';

interface TaskRowProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/tasks/${task.id}`}
          className={`font-medium hover:text-blue-600 ${
            task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {task.title}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(task.dueDate)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{task.assignedTo ?? '—'}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            task.isCompleted
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {task.isCompleted ? 'Done' : 'Pending'}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          to={`/tasks/${task.id}/edit`}
          className="mr-3 text-sm text-blue-600 hover:text-blue-800"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
