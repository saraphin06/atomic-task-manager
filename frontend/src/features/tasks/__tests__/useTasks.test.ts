import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { useTasks, useTask } from '../hooks/useTasks.ts';
import { taskApi } from '../../../api/taskApi.ts';
import type { PagedResponse, Task } from '../../../types/task.ts';

vi.mock('../../../api/taskApi.ts', () => ({
  taskApi: {
    getTasks: vi.fn(),
    getTaskById: vi.fn(),
  },
}));

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Description',
  isCompleted: false,
  dueDate: '2026-06-15T10:00:00',
  createdAt: '2026-01-01T10:00:00',
  updatedAt: '2026-01-01T10:00:00',
  assignedTo: 'Alice',
};

const mockPagedResponse: PagedResponse<Task> = {
  content: [mockTask],
  totalElements: 1,
  totalPages: 1,
  page: 0,
  size: 10,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches tasks successfully', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue(mockPagedResponse);

    const { result } = renderHook(() => useTasks({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPagedResponse);
    expect(taskApi.getTasks).toHaveBeenCalledWith({});
  });

  it('passes query params to the API', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValue(mockPagedResponse);

    const params = { isCompleted: true, page: 2, size: 20 };
    const { result } = renderHook(() => useTasks(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(taskApi.getTasks).toHaveBeenCalledWith(params);
  });

  it('handles API errors', async () => {
    vi.mocked(taskApi.getTasks).mockRejectedValue({
      status: 500,
      message: 'Server error',
      timestamp: '2026-01-01T00:00:00',
    });

    const { result } = renderHook(() => useTasks({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches a single task by ID', async () => {
    vi.mocked(taskApi.getTaskById).mockResolvedValue(mockTask);

    const { result } = renderHook(() => useTask(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTask);
    expect(taskApi.getTaskById).toHaveBeenCalledWith(1);
  });

  it('does not fetch when id is 0', () => {
    const { result } = renderHook(() => useTask(0), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(taskApi.getTaskById).not.toHaveBeenCalled();
  });
});
