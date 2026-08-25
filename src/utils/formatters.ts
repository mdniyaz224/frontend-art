// ============================================================
// Formatting Utilities
// ============================================================

import dayjs from 'dayjs';

/**
 * Format a date string or Date to a readable format.
 */
export const formatDate = (date: string | Date | null | undefined, format = 'MMM DD, YYYY'): string => {
  if (!date) return '—';
  return dayjs(date).format(format);
};

/**
 * Format a date with time.
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMM DD, YYYY HH:mm');
};

/**
 * Format a number as currency.
 */
export const formatCurrency = (
  amount: number | null | undefined,
  currency = 'USD',
  locale = 'en-US',
): string => {
  if (amount == null) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number with thousands separators.
 */
export const formatNumber = (
  value: number | null | undefined,
  locale = 'en-US',
): string => {
  if (value == null) return '—';
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Truncate a string to a maximum length.
 */
export const truncate = (str: string, maxLength = 50): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
};

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert a status enum value to a display label.
 * e.g., "IN_MAINTENANCE" → "In Maintenance"
 */
export const statusToLabel = (status: string): string => {
  return status
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
};
