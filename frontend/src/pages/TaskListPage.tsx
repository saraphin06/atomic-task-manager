import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../features/tasks/hooks/useTasks.ts';
import { useToggleTask, useDeleteTask } from '../features/tasks/hooks/useTaskMutations.ts';
import { TaskTable } from '../features/tasks/components/TaskTable.tsx';
import { TaskFilters } from '../features/tasks/components/TaskFilters.tsx';
import { Pagination } from '../components/Pagination.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { ConfirmDialog } from '../components/ConfirmDialog.tsx';
import type { TaskQueryParams, ApiError } from '../types/task.ts';

export function TaskListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState<TaskQueryParams>({
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch } = useTasks(params);
  const toggleMutation = useToggleTask();
  const deleteMutation = useDeleteTask();

  const handleParamsChange = useCallback((updates: Partial<TaskQueryParams>) => {
    setParams((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleToggle = useCallback(
    (id: number) => {
      toggleMutation.mutate(id);
    },
    [toggleMutation]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget !== null) {
      deleteMutation.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteMutation]);

  return (
    <section aria-labelledby="task-list-heading">
      <div className="mb-6 flex items-center justify-between">
        <h1 id="task-list-heading" className="text-2xl font-bold text-gray-900">
          Tasks
        </h1>
      </div>

      <TaskFilters params={params} onChange={handleParamsChange} />

      <div className="mt-4" aria-live="polite">
        {isLoading && <LoadingSpinner />}

        {isError && (
          <ErrorMessage
            message={(error as unknown as ApiError)?.message ?? 'Failed to load tasks.'}
            onRetry={() => void refetch()}
          />
        )}

        {data && data.content.length === 0 && (
          <EmptyState
            message="No tasks found. Create your first task to get started."
            actionLabel="Create Task"
            onAction={() => navigate('/tasks/new')}
          />
        )}

        {data && data.content.length > 0 && (
          <>
            <TaskTable
              tasks={data.content}
              onToggle={handleToggle}
              onDelete={setDeleteTarget}
            />
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={(page) => handleParamsChange({ page })}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
