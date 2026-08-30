import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data found',
  description,
  icon,
  action,
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
          bgcolor: 'rgba(99, 102, 241, 0.08)',
          mb: 2,
        }}
      >
        {icon || <InboxRoundedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />}
      </Box>
      <Typography variant="h6" gutterBottom>
        {message}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 2 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
};

export default React.memo(EmptyState);
