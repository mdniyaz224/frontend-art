// ============================================================
// Dashboard Chart Palette
// ============================================================
// Validated against this app's actual dark chart surface (~#0f172a, the
// composited MUI paper color — the app has no light mode) using the
// dataviz skill's validator: `node scripts/validate_palette.js
// "#3987e5,#d95926,#199e70" --mode dark --surface "#0f172a" --pairs all`
// → ALL CHECKS PASS (worst all-pairs CVD ΔE 9.4, normal-vision ΔE 20.9,
// all ≥3:1 contrast). Never reorder these three or add a 4th categorical
// slot without re-running the validator — see the skill's color-formula.md.

/** Fixed 3-slot categorical order — identity encoding, never reassigned by filters. */
export const CATEGORICAL_SEQUENCE = ['#3987e5', '#d95926', '#199e70'] as const;

/** Single sequential hue for magnitude (count-per-category bar chart). */
export const SEQUENTIAL_HUE = '#3987e5';

/** Fixed status palette — reserved for state, never reused as a categorical series. */
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
