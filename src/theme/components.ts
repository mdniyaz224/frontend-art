import type { Components, Theme } from '@mui/material/styles';

export const componentOverrides: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        overflow: 'hidden',
        scrollbarWidth: 'thin',
        backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%)',
        backgroundAttachment: 'fixed',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.12)',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255,255,255,0.2)',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '10px 24px',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          transform: 'translateY(-1px)',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
        },
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
        },
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        backgroundImage: 'none',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: 16,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          backgroundColor: 'rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease-in-out',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.24)',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '1.5px',
            borderColor: '#6366f1',
          },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: 'rgba(7, 11, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px -8px rgba(0, 0, 0, 0.4)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 24,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
      },
      head: {
        fontWeight: 700,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        color: '#94a3b8',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        marginBottom: 4,
        padding: '10px 16px',
        transition: 'all 0.2s ease-in-out',
        '&.Mui-selected': {
          background: 'linear-gradient(90deg, rgba(249, 168, 212, 0.2) 0%, rgba(249, 168, 212, 0) 100%)',
          borderLeft: '4px solid #f9a8d4',
          '&:hover': {
            background: 'linear-gradient(90deg, rgba(249, 168, 212, 0.3) 0%, rgba(249, 168, 212, 0) 100%)',
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
};
