export const PASTEL_PINK_ACCENT = '#f9a8d4';
export const PASTEL_PINK_ACCENT_DARK = '#f472b6';
export const PASTEL_PINK_ACCENT_TEXT = '#1a1625';

export const pastelPinkButtonSx = {
  bgcolor: PASTEL_PINK_ACCENT,
  backgroundImage: 'none',
  color: PASTEL_PINK_ACCENT_TEXT,
  fontWeight: 700,
  '&:hover': { bgcolor: PASTEL_PINK_ACCENT_DARK, backgroundImage: 'none' },
} as const;
