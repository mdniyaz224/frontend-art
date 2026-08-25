// ============================================================
// Global Type Definitions for API Communication
// ============================================================

/**
 * Standard API response envelope.
 * All backend responses should conform to this shape.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Paginated API response for list endpoints.
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

/**
 * Pagination metadata returned by the server.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Pagination parameters sent to the server.
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Sort parameters sent to the server.
 */
export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Query parameters for list endpoints combining pagination, sorting, and search.
 */
export interface ListQueryParams extends Partial<PaginationParams>, Partial<SortParams> {
  search?: string;
  [key: string]: unknown;
}

/**
 * Standardized API error structure.
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: ValidationError[];
  code?: string;
}

/**
 * Field-level validation error from the backend.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Generic async state for Redux slices.
 */
export interface AsyncState {
  loading: boolean;
  error: string | null;
}

/**
 * Generic list state for Redux slices that manage paginated data.
 */
export interface ListState<T> extends AsyncState {
  data: T[];
  pagination: PaginationMeta;
}

/** Default pagination meta for initial state */
export const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
