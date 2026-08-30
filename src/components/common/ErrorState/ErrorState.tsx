import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

interface ErrorStateProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong',
  description = 'An error occurred while loading the data. Please try again.',
  onRetry,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(239, 68, 68, 0.08)',
          mb: 2,
        }}
      >
        <ErrorOutlineRoundedIcon sx={{ fontSize: 32, color: 'error.main' }} />
      </Box>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
        {description}
      </Typography>
      {onRetry && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default React.memo(ErrorState);
