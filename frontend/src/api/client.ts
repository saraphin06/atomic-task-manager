import axios from 'axios';
import type { ApiError } from '../types/task.ts';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const apiError: ApiError = error.response.data;
      return Promise.reject(apiError);
    }
    const networkError: ApiError = {
      status: 0,
      message: 'Unable to connect to server. Please check your connection.',
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(networkError);
  }
);

export default apiClient;
