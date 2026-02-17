import { useNavigate } from 'react-router-dom';
import { useCreateTask } from '../features/tasks/hooks/useTaskMutations.ts';
import { TaskForm } from '../features/tasks/components/TaskForm.tsx';
import type { TaskCreateRequest, ApiError } from '../types/task.ts';

export function TaskCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateTask();

  const handleSubmit = (data: TaskCreateRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate('/tasks'),
    });
  };

  return (
    <section aria-labelledby="create-task-heading">
      <h1 id="create-task-heading" className="mb-6 text-2xl font-bold text-gray-900">
        Create New Task
      </h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <TaskForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          serverError={createMutation.error as ApiError | null}
          submitLabel="Create Task"
        />
      </div>
    </section>
  );
}
