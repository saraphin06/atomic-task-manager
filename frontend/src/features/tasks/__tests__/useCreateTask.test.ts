import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';
import { useCreateTask, useDeleteTask, useToggleTask } from '../hooks/useTaskMutations.ts';
import { taskApi } from '../../../api/taskApi.ts';
import type { Task } from '../../../types/task.ts';

vi.mock('../../../api/taskApi.ts', () => ({
  taskApi: {
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTask: vi.fn(),
  },
}));

const mockTask: Task = {
  id: 1,
  title: 'New Task',
  description: 'Created',
  isCompleted: false,
  dueDate: null,
  createdAt: '2026-01-01T10:00:00',
  updatedAt: '2026-01-01T10:00:00',
  assignedTo: null,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCreateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a task and returns data', async () => {
    vi.mocked(taskApi.createTask).mockResolvedValue(mockTask);

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ title: 'New Task' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(taskApi.createTask).toHaveBeenCalledWith({ title: 'New Task' });
    expect(result.current.data).toEqual(mockTask);
  });

  it('handles creation errors', async () => {
    vi.mocked(taskApi.createTask).mockRejectedValue({
      status: 400,
      message: 'Validation failed',
      timestamp: '2026-01-01T00:00:00',
      errors: [{ field: 'title', message: 'Title is required' }],
    });

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ title: '' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useToggleTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles a task', async () => {
    const toggled = { ...mockTask, isCompleted: true };
    vi.mocked(taskApi.toggleTask).mockResolvedValue(toggled);

    const { result } = renderHook(() => useToggleTask(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(taskApi.toggleTask).toHaveBeenCalledWith(1);
    expect(result.current.data?.isCompleted).toBe(true);
  });
});

describe('useDeleteTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes a task', async () => {
    vi.mocked(taskApi.deleteTask).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(taskApi.deleteTask).toHaveBeenCalledWith(1);
  });
});
