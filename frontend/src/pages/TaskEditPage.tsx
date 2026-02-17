import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask } from '../features/tasks/hooks/useTasks.ts';
import { useUpdateTask } from '../features/tasks/hooks/useTaskMutations.ts';
import { TaskForm } from '../features/tasks/components/TaskForm.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import type { TaskCreateRequest, ApiError } from '../types/task.ts';

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = Number(id);
  const { data: task, isLoading, isError, error } = useTask(taskId);
  const updateMutation = useUpdateTask();

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

  const handleSubmit = (data: TaskCreateRequest) => {
    updateMutation.mutate(
      { id: taskId, data },
      { onSuccess: () => navigate(`/tasks/${taskId}`) }
    );
  };

  return (
    <section aria-labelledby="edit-task-heading">
      <h1 id="edit-task-heading" className="mb-6 text-2xl font-bold text-gray-900">
        Edit Task
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <TaskForm
          defaultValues={{
            title: task.title,
            description: task.description ?? '',
            dueDate: task.dueDate ?? undefined,
            assignedTo: task.assignedTo ?? '',
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          serverError={updateMutation.error as ApiError | null}
          submitLabel="Update Task"
        />
      </div>
      <div className="mt-4">
        <Link to={`/tasks/${taskId}`} className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to task details
        </Link>
      </div>
    </section>
  );
}
