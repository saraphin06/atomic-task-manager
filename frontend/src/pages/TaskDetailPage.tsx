import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask } from '../features/tasks/hooks/useTasks.ts';
import { useToggleTask, useDeleteTask } from '../features/tasks/hooks/useTaskMutations.ts';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import { ConfirmDialog } from '../components/ConfirmDialog.tsx';
import { formatDateTime } from '../utils/formatDate.ts';
import type { ApiError } from '../types/task.ts';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = Number(id);
  const { data: task, isLoading, isError, error } = useTask(taskId);
  const toggleMutation = useToggleTask();
  const deleteMutation = useDeleteTask();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    const apiError = error as unknown as ApiError;
    if (apiError?.status === 404) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Task not found.</p>
          <Link to="/tasks" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Back to task list
          </Link>
        </div>
      );
    }
    return <ErrorMessage message={apiError?.message ?? 'Failed to load task.'} />;
  }

  if (!task) return null;

  const handleDelete = () => {
    deleteMutation.mutate(taskId, {
      onSuccess: () => navigate('/tasks'),
    });
    setShowDeleteDialog(false);
  };

  return (
    <section aria-labelledby="task-detail-heading">
      <div className="mb-6 flex items-center justify-between">
        <h1 id="task-detail-heading" className="text-2xl font-bold text-gray-900">
          {task.title}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => toggleMutation.mutate(taskId)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <Link
            to={`/tasks/${taskId}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  task.isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.isCompleted ? 'Completed' : 'Pending'}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
            <dd className="mt-1 text-gray-900">{task.assignedTo ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Due Date</dt>
            <dd className="mt-1 text-gray-900">{formatDateTime(task.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-gray-900">{formatDateTime(task.createdAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 whitespace-pre-wrap text-gray-900">
              {task.description || '—'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4">
        <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to task list
        </Link>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </section>
  );
}
