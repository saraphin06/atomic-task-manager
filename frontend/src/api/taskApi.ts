import apiClient from './client.ts';
import type {
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskQueryParams,
  PagedResponse,
} from '../types/task.ts';

export const taskApi = {
  getTasks: async (params: TaskQueryParams = {}): Promise<PagedResponse<Task>> => {
    const { data } = await apiClient.get<PagedResponse<Task>>('/tasks', { params });
    return data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const { data } = await apiClient.get<Task>(`/tasks/${id}`);
    return data;
  },

  createTask: async (request: TaskCreateRequest): Promise<Task> => {
    const { data } = await apiClient.post<Task>('/tasks', request);
    return data;
  },

  updateTask: async (id: number, request: TaskUpdateRequest): Promise<Task> => {
    const { data } = await apiClient.put<Task>(`/tasks/${id}`, request);
    return data;
  },

  toggleTask: async (id: number): Promise<Task> => {
    const { data } = await apiClient.patch<Task>(`/tasks/${id}/toggle`);
    return data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
