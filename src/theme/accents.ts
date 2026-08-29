// ============================================================
// Pastel Pink Accent — shared across feature panels
// ============================================================
// Several feature designs (Staff, Inventory) use a soft pastel-pink accent
// with dark text (primary buttons, active tabs, status pills) distinct
// from the app's global indigo/purple theme. Kept here rather than in the
// shared theme so unrelated modules (Login, Dashboard, Sidebar) are
// unaffected — this is an opt-in accent for specific feature UIs, not a
// global palette change.

export const PASTEL_PINK_ACCENT = '#f9a8d4';
export const PASTEL_PINK_ACCENT_DARK = '#f472b6';
export const PASTEL_PINK_ACCENT_TEXT = '#1a1625';

/**
 * sx for a solid pastel-pink Button. `variant="contained"` + the default
 * primary color pulls in the theme's `MuiButton.containedPrimary` override,
 * which sets the `background` shorthand (a gradient) — that beats a plain
 * `bgcolor` in specificity, so `backgroundImage: 'none'` must cancel it
 * explicitly or the button renders the theme's indigo gradient instead.
 */
export const pastelPinkButtonSx = {
  bgcolor: PASTEL_PINK_ACCENT,
  backgroundImage: 'none',
  color: PASTEL_PINK_ACCENT_TEXT,
  fontWeight: 700,
  '&:hover': { bgcolor: PASTEL_PINK_ACCENT_DARK, backgroundImage: 'none' },
} as const;
