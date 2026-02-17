import { useForm } from 'react-hook-form';
import type { TaskCreateRequest, ApiError } from '../../../types/task.ts';
import { toInputDateTimeLocal } from '../../../utils/formatDate.ts';

interface TaskFormProps {
  defaultValues?: Partial<TaskCreateRequest & { isCompleted?: boolean }>;
  onSubmit: (data: TaskCreateRequest) => void;
  isSubmitting: boolean;
  serverError?: ApiError | null;
  submitLabel?: string;
}

export function TaskForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel = 'Save Task',
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskCreateRequest>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      dueDate: defaultValues?.dueDate ? toInputDateTimeLocal(defaultValues.dueDate) : '',
      assignedTo: defaultValues?.assignedTo ?? '',
    },
  });

  const fieldServerError = (field: string): string | undefined =>
    serverError?.errors?.find((e) => e.field === field)?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && !serverError.errors && (
        <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {serverError.message}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title', {
            required: 'Title is required',
            maxLength: { value: 100, message: 'Title must not exceed 100 characters' },
          })}
          aria-invalid={!!errors.title || !!fieldServerError('title')}
          aria-describedby={errors.title || fieldServerError('title') ? 'title-error' : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {(errors.title || fieldServerError('title')) && (
          <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.title?.message ?? fieldServerError('title')}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description', {
            maxLength: { value: 500, message: 'Description must not exceed 500 characters' },
          })}
          aria-invalid={!!errors.description}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          {...register('dueDate')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
          Assigned To
        </label>
        <input
          id="assignedTo"
          type="text"
          {...register('assignedTo')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
