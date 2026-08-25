// ============================================================
// PermissionRoute — Requires Specific Permission
// ============================================================

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';

interface PermissionRouteProps {
  permission: string;
  children: React.ReactNode;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({ permission, children }) => {
  const hasPermission = usePermission(permission);
  const navigate = useNavigate();

  if (!hasPermission) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(239, 68, 68, 0.08)',
            mb: 3,
          }}
        >
          <LockRoundedIcon sx={{ fontSize: 40, color: 'error.main' }} />
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
          You don't have permission to access this page. Contact your administrator to request access.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

export default PermissionRoute;
