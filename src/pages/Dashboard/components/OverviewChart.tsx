// ============================================================
// OverviewChart — Sales vs. Revenue over time
// ============================================================
// Two series sharing one $-scale y-axis (never dual-axis — see the
// dataviz skill's anti-patterns). Colors come from OVERVIEW_SERIES_COLORS
// in dashboardPalette.ts, validated for line-vs-line contrast — do not
// hardcode colors here.

import React from 'react';
import { Box, Button, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Skeleton } from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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

/** "$0"/"$5k" style compact axis ticks. */
const formatAxisTick = (v: number): string => (v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`);

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
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={range}
              onChange={(_e, next: OverviewRange | null) => {
                if (next) onRangeChange(next);
              }}
            >
              {RANGE_OPTIONS.map((opt) => (
                <ToggleButton key={opt.value} value={opt.value} sx={{ px: 2, textTransform: 'none' }}>
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {canExport && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<FileDownloadRoundedIcon fontSize="small" />}
                onClick={onExport}
                disabled={data.length === 0}
              >
                Export
              </Button>
            )}
          </Box>
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
                />
                <Legend
                  formatter={(value) => <span style={{ color: CHART_INK.secondary }}>{value}</span>}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales"
                  stroke={OVERVIEW_SERIES_COLORS.sales}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={OVERVIEW_SERIES_COLORS.revenue}
                  strokeWidth={2}
                  dot={false}
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
