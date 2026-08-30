export const CATEGORICAL_SEQUENCE = ['#3987e5', '#d95926', '#199e70'] as const;

export const SEQUENTIAL_HUE = '#3987e5';

export const STATUS_COLORS = {
  good: '#0ca30c',
  warning: '#fab219',
  critical: '#d03b3b',
  neutral: '#64748b',
} as const;

export const CHART_INK = {
  primary: '#f8fafc',
  secondary: '#94a3b8',
  muted: '#64748b',
  grid: 'rgba(255, 255, 255, 0.08)',
  surface: '#0f172a',
} as const;

export const tooltipContentStyle = {
  background: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 10,
  color: CHART_INK.primary,
  fontSize: 13,
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
} as const;

export const tooltipLabelStyle = {
  color: CHART_INK.primary,
  fontWeight: 600,
  marginBottom: 4,
} as const;

export const tooltipItemStyle = {
  color: CHART_INK.secondary,
} as const;

export const OVERVIEW_SERIES_COLORS = {
  sales: '#ec4899',
  revenue: '#8b5cf6',
} as const;
