import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../../../api/taskApi.ts';
import type { TaskQueryParams } from '../../../types/task.ts';

export function useTasks(params: TaskQueryParams = {}) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskApi.getTasks(params),
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskApi.getTaskById(id),
    enabled: id > 0,
  });
}
