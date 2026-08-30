import React from 'react';
import { Box, Card, CardContent, Typography, alpha, Skeleton } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  caption?: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, caption, icon, color, loading }) => {
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px -8px ${alpha(color, 0.3)}`,
          borderColor: alpha(color, 0.3),
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: color,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${alpha(color, 0.15)} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1, letterSpacing: '0.02em', textTransform: 'uppercase' }}
              noWrap
            >
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={64} height={44} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                {value}
              </Typography>
            )}
            {caption && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                {caption}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color,
              boxShadow: `0 8px 16px -4px ${alpha(color, 0.4)}`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
