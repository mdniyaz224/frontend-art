import dayjs from 'dayjs';

export const formatDate = (date: string | Date | null | undefined, format = 'MMM DD, YYYY'): string => {
  if (!date) return '—';
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMM DD, YYYY HH:mm');
};

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

export const formatCompactCurrency = (
  amount: number | null | undefined,
  currency = 'USD',
  locale = 'en-US',
): string => {
  if (amount == null) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

export const formatNumber = (
  value: number | null | undefined,
  locale = 'en-US',
): string => {
  if (value == null) return '—';
  return new Intl.NumberFormat(locale).format(value);
};

export const truncate = (str: string, maxLength = 50): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const statusToLabel = (status: string): string => {
  return status
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
};

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

export const shortId = (id: string): string => `#${id.slice(-4).toUpperCase()}`;

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0].slice(0, 2);
  return initials.toUpperCase();
};
