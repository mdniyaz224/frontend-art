export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ListQueryParams extends Partial<PaginationParams>, Partial<SortParams> {
  search?: string;
  [key: string]: unknown;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: ValidationError[];
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AsyncState {
  loading: boolean;
  error: string | null;
}

export interface ListState<T> extends AsyncState {
  data: T[];
  pagination: PaginationMeta;
}

export const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
