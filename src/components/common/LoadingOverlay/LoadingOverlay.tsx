import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen
          ? {
              position: 'fixed',
              inset: 0,
              bgcolor: 'rgba(10, 14, 26, 0.85)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
            }
          : {
              py: 8,
              width: '100%',
            }),
      }}
    >
      <CircularProgress
        size={40}
        sx={{
          color: 'primary.main',
        }}
      />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(LoadingOverlay);
