import type { TaskQueryParams } from '../../../types/task.ts';

interface TaskFiltersProps {
  params: TaskQueryParams;
  onChange: (params: Partial<TaskQueryParams>) => void;
}

export function TaskFilters({ params, onChange }: TaskFiltersProps) {
  return (
    <div className="space-y-3">
      <section aria-label="Task filters" className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="w-full text-sm font-semibold text-gray-900">Filters</h2>
        <div>
          <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="filter-status"
            value={params.isCompleted === undefined ? '' : String(params.isCompleted)}
            onChange={(e) =>
              onChange({
                isCompleted: e.target.value === '' ? undefined : e.target.value === 'true',
                page: 0,
              })
            }
            className="mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-due-from" className="block text-sm font-medium text-gray-700">
            Due from
          </label>
          <input
            id="filter-due-from"
            type="datetime-local"
            value={params.dueDateFrom ?? ''}
            onChange={(e) => onChange({ dueDateFrom: e.target.value || undefined, page: 0 })}
            className="mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label htmlFor="filter-due-to" className="block text-sm font-medium text-gray-700">
            Due to
          </label>
          <input
            id="filter-due-to"
            type="datetime-local"
            value={params.dueDateTo ?? ''}
            onChange={(e) => onChange({ dueDateTo: e.target.value || undefined, page: 0 })}
            className="mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
      </section>

      <section aria-label="Task sorting" className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="w-full text-sm font-semibold text-gray-900">Sort</h2>
        <div>
          <label htmlFor="sort-field" className="block text-sm font-medium text-gray-700">
            Sort by
          </label>
          <select
            id="sort-field"
            value={params.sortBy ?? 'createdAt'}
            onChange={(e) =>
              onChange({ sortBy: e.target.value as TaskQueryParams['sortBy'] })
            }
            className="mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-direction" className="block text-sm font-medium text-gray-700">
            Direction
          </label>
          <select
            id="sort-direction"
            value={params.sortDirection ?? 'asc'}
            onChange={(e) =>
              onChange({ sortDirection: e.target.value as TaskQueryParams['sortDirection'] })
            }
            className="mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </section>
    </div>
  );
}
