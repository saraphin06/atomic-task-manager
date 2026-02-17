export interface Task {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo: string | null;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
  assignedTo?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  errors?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface TaskQueryParams {
  isCompleted?: boolean;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'title' | 'dueDate' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  size?: number;
}
