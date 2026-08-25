// ============================================================
// General Helper Utilities
// ============================================================

import type { AxiosError } from 'axios';
import type { ApiError } from '../types/api';

/**
 * Extract a human-readable error message from an Axios error.
 * Handles:
 * - Standard API error responses
 * - Validation error arrays
 * - Network errors
 * - Unknown errors
 */
export const getApiErrorMessage = (error: unknown): string => {
  // Axios error with a response from the server
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Partial<ApiError> & { message?: string };

    // Validation errors — join all field messages
    if (data.errors && data.errors.length > 0) {
      return data.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
    }

    // Standard error message
    if (data.message) {
      return data.message;
    }
  }

  // Network / timeout error
  if (isAxiosError(error) && !error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  // Generic JS Error
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Type guard for AxiosError.
 */
function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

/**
 * Generate query string parameters from an object.
 * Strips undefined/null values.
 */
export const buildQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

/**
 * Simple deep clone using structuredClone (modern browsers) or JSON fallback.
 */
export const deepClone = <T>(obj: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Delay utility for testing / dev purposes.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
