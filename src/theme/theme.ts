// ============================================================
// MUI Theme Configuration — Dark Enterprise Theme
// ============================================================

import { createTheme } from '@mui/material/styles';
import { typography } from './typography';
import { componentOverrides } from './components';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff4b4b',
      light: '#ff7676',
      dark: '#e33e3e',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#070b14', // Deeper space background
      paper: 'rgba(15, 23, 42, 0.65)', // Glassmorphic paper base
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      disabled: '#475569',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    action: {
      hover: 'rgba(255, 255, 255, 0.06)',
      selected: 'rgba(99, 102, 241, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.08)',
    },
  },
  typography,
  shape: {
    borderRadius: 14,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.4)',
    '0 4px 8px rgba(0,0,0,0.4)',
    '0 6px 12px rgba(0,0,0,0.4)',
    '0 8px 16px rgba(0,0,0,0.4)',
    '0 12px 24px rgba(0,0,0,0.5)',
    '0 16px 32px rgba(0,0,0,0.5)',
    '0 20px 40px rgba(0,0,0,0.5)',
    '0 24px 48px rgba(0,0,0,0.5)',
    '0 32px 64px rgba(0,0,0,0.6)',
    '0 40px 80px rgba(0,0,0,0.6)',
    '0 48px 96px rgba(0,0,0,0.6)',
    '0 56px 112px rgba(0,0,0,0.6)',
    '0 64px 128px rgba(0,0,0,0.6)',
    '0 72px 144px rgba(0,0,0,0.6)',
    '0 80px 160px rgba(0,0,0,0.6)',
    '0 88px 176px rgba(0,0,0,0.6)',
    '0 96px 192px rgba(0,0,0,0.6)',
    '0 104px 208px rgba(0,0,0,0.6)',
    '0 112px 224px rgba(0,0,0,0.6)',
    '0 120px 240px rgba(0,0,0,0.6)',
    '0 128px 256px rgba(0,0,0,0.6)',
    '0 136px 272px rgba(0,0,0,0.6)',
    '0 144px 288px rgba(0,0,0,0.6)',
    '0 152px 304px rgba(0,0,0,0.6)',
  ],
  components: componentOverrides,
});

export default theme;
