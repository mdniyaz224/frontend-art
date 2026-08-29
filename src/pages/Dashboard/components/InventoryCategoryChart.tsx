// ============================================================
// InventoryCategoryChart — product count per category
// ============================================================
// A single-series magnitude comparison, so it gets one sequential hue
// (never a rainbow) rather than a categorical palette — categories here
// are free-text and open-ended (Decision 5 of the Inventory plan), so
// there is no fixed hue to assign per name. Horizontal bars keep
// long/variable-length category names readable without rotated labels.

import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_INK, SEQUENTIAL_HUE, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from '../dashboardPalette';

const MAX_BARS = 7;

export interface CategoryDatum {
  category: string;
  count: number;
}

interface InventoryCategoryChartProps {
  data: CategoryDatum[];
}

const InventoryCategoryChart: React.FC<InventoryCategoryChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No inventory yet — add a product to see the category breakdown.
        </Typography>
      </Box>
    );
  }

  const sorted = [...data].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, MAX_BARS);
  const rest = sorted.slice(MAX_BARS);
  const restTotal = rest.reduce((sum, d) => sum + d.count, 0);
  const chartData = restTotal > 0 ? [...top, { category: 'Other', count: restTotal }] : top;
  const height = Math.max(220, chartData.length * 40);

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke={CHART_INK.grid} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: CHART_INK.secondary, fontSize: 12 }}
            axisLine={{ stroke: CHART_INK.grid }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={100}
            tick={{ fill: CHART_INK.secondary, fontSize: 12 }}
            axisLine={{ stroke: CHART_INK.grid }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            formatter={(value) => {
              const numeric = Number(value) || 0;
              return [`${numeric} product${numeric === 1 ? '' : 's'}`, 'Count'];
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={entry.category === 'Other' ? CHART_INK.muted : SEQUENTIAL_HUE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default InventoryCategoryChart;
