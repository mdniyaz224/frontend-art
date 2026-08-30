import type { AxiosError } from 'axios';
import type { ApiError } from '../types/api';

export const getApiErrorMessage = (error: unknown): string => {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Partial<ApiError> & {
      message?: string;
      details?: { path: string; message: string }[] | string[];
    };

    if (data.errors && data.errors.length > 0) {
      return data.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
    }

    if (data.details && data.details.length > 0) {
      return data.details
        .map((d) => (typeof d === 'string' ? d : `${d.path}: ${d.message}`))
        .join(', ');
    }

    if (data.message) {
      return data.message;
    }
  }

  if (isAxiosError(error) && !error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

export const buildQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

export const deepClone = <T>(obj: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
