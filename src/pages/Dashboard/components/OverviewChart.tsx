import React from 'react';
import { Box, Button, Card, CardContent, Typography, Skeleton } from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  CHART_INK,
  OVERVIEW_SERIES_COLORS,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from '../dashboardPalette';
import { formatCurrency } from '../../../utils/formatters';
import type { OverviewPoint, OverviewRange } from '../../../features/sales/salesTypes';

const RANGE_OPTIONS: { label: string; value: OverviewRange }[] = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
];

const LEGEND_ITEMS: { label: string; color: string }[] = [
  { label: 'Sales', color: OVERVIEW_SERIES_COLORS.sales },
  { label: 'Revenue', color: CHART_INK.secondary },
];

const formatAxisTick = (v: number): string => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`);

interface OverviewChartProps {
  data: OverviewPoint[];
  range: OverviewRange;
  onRangeChange: (range: OverviewRange) => void;
  onExport: () => void;
  canExport: boolean;
  loading?: boolean;
}

const OverviewChart: React.FC<OverviewChartProps> = ({ data, range, onRangeChange, onExport, canExport, loading }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {RANGE_OPTIONS.map((opt) => {
                const selected = opt.value === range;
                return (
                  <Button
                    key={opt.value}
                    size="small"
                    onClick={() => onRangeChange(opt.value)}
                    sx={{
                      px: 2,
                      py: 0.5,
                      minWidth: 0,
                      borderRadius: 999,
                      fontWeight: 600,
                      color: selected ? '#fff' : 'text.secondary',
                      bgcolor: selected ? OVERVIEW_SERIES_COLORS.sales : 'transparent',
                      '&:hover': {
                        bgcolor: selected ? OVERVIEW_SERIES_COLORS.sales : 'action.hover',
                        boxShadow: 'none',
                        transform: 'none',
                      },
                    }}
                  >
                    {opt.label}
                  </Button>
                );
              })}
            </Box>
            {canExport && (
              <Button
                variant="contained"
                size="small"
                startIcon={<FileDownloadRoundedIcon fontSize="small" />}
                onClick={onExport}
                disabled={data.length === 0}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: 'text.primary', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.14)' } }}
              >
                Export
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2 }}>
          {LEGEND_ITEMS.map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {loading ? (
          <Skeleton variant="rounded" height={300} />
        ) : data.length === 0 ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No orders yet for this range.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 4 }}>
                <CartesianGrid stroke={CHART_INK.grid} vertical={false} />
                <XAxis
                  dataKey="period"
                  tick={{ fill: CHART_INK.secondary, fontSize: 12 }}
                  axisLine={{ stroke: CHART_INK.grid }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatAxisTick}
                  tick={{ fill: CHART_INK.secondary, fontSize: 12 }}
                  axisLine={{ stroke: CHART_INK.grid }}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  formatter={(value, name) => [formatCurrency(Number(value) || 0), String(name)]}
                  cursor={{ stroke: OVERVIEW_SERIES_COLORS.sales, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke={OVERVIEW_SERIES_COLORS.sales}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: OVERVIEW_SERIES_COLORS.sales, stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={CHART_INK.secondary}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: CHART_INK.secondary, stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
