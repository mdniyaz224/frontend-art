// ============================================================
// SparklineStatCard — headline metric + trend strip
// ============================================================
// A deliberate sibling to StatCard, not an extension of it — StatCard's
// visual language (top accent bar, radial glow, 56px rounded-square icon)
// is a different design system from this one (small circular icon, bottom
// bar-sparkline strip), and the four existing StatCard call sites (Total
// Staff/Inventory/Low Stock/Out of Stock) stay untouched.

import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import type { SparklinePoint } from '../../../features/sales/salesTypes';

interface SparklineStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  sparkline: SparklinePoint[];
  sparklineColor: string;
  loading?: boolean;
}

const SparklineStatCard: React.FC<SparklineStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  sparkline,
  sparklineColor,
  loading,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}
            noWrap
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: iconColor,
            }}
          >
            {icon}
          </Box>
        </Box>

        {loading ? (
          <Skeleton variant="text" width={96} height={44} />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            {value}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, mb: 2 }}>
          {subtitle}
        </Typography>

        <Box sx={{ width: '100%', height: 48 }}>
          {sparkline.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Bar
                  dataKey="value"
                  fill={sparklineColor}
                  radius={[3, 3, 0, 0]}
                  maxBarSize={10}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SparklineStatCard;
