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

/**
 * Format a 24-hour "HH:mm" shift time compactly, e.g. "09:00" → "9am",
 * "13:30" → "1:30pm". Minutes are dropped when they're zero.
 *
 * Not every User record has shift times set (e.g. the bootstrap admin
 * created by `seed:admin` bypasses the staff-creation validator that
 * normally requires them), so this tolerates a missing/malformed value.
 */
export const formatShiftTime = (time: string | null | undefined): string => {
  if (!time || !time.includes(':')) return '—';
  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return '—';
  const period = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${displayHour}${period}` : `${displayHour}:${minuteStr}${period}`;
};

export const formatShiftRange = (
  start: string | null | undefined,
  end: string | null | undefined,
): string => {
  if (!start && !end) return '—';
  return `${formatShiftTime(start)} to ${formatShiftTime(end)}`;
};

/**
 * be-boiler's staff IDs are Mongo ObjectIds, not a sequential number — this
 * derives a short, table-friendly display id from the tail of the real id.
 */
export const shortId = (id: string): string => `#${id.slice(-4).toUpperCase()}`;

/** First + last initial (or first two letters of a single-word name), uppercased. */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
  return initials.toUpperCase();
};
