import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import type { BreadcrumbItem } from '../../../types/common';
import Breadcrumb from '../../layout/Breadcrumb/Breadcrumb';

interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: PageHeaderAction[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions }) => {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Breadcrumb items={breadcrumbs} />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && actions.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                onClick={action.onClick}
                startIcon={action.icon}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(PageHeader);
