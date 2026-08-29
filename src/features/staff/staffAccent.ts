// ============================================================
// Staff Module Accent Color
// ============================================================
// Re-exports the shared pastel-pink accent (src/theme/accents.ts) under
// its original Staff-specific names — kept so existing Staff imports don't
// need to change now that Inventory uses the same accent too.

export {
  PASTEL_PINK_ACCENT as STAFF_ACCENT,
  PASTEL_PINK_ACCENT_DARK as STAFF_ACCENT_DARK,
  PASTEL_PINK_ACCENT_TEXT as STAFF_ACCENT_TEXT,
  pastelPinkButtonSx as staffAccentButtonSx,
} from '../../theme/accents';
