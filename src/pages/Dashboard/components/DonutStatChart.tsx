// ============================================================
// DonutStatChart — shared donut used by Staff-by-Role and
// Product-by-Status
// ============================================================
// A single series needs no legend box per the dataviz skill, but these
// charts always have >=2 slices, so a legend is always rendered alongside
// direct value labels (n<=4 slices here, well under the "direct-label
// everything" cutoff of 4). Identity is never color-alone: every slice is
// named in both the legend and its own label.

import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_INK, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from '../dashboardPalette';

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface DonutStatChartProps {
  data: DonutSlice[];
  centerLabel: string;
  emptyMessage: string;
}

const DonutStatChart: React.FC<DonutStatChartProps> = ({ data, centerLabel, emptyMessage }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const nonZero = data.filter((d) => d.value > 0);

  if (total === 0) {
    return (
      <Box
        sx={{
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Box sx={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={data.length > 1 ? 3 : 0}
              cornerRadius={4}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((slice) => (
                <Cell key={slice.key} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              formatter={(value, _name, item) => {
                const numeric = Number(value) || 0;
                const pct = total > 0 ? Math.round((numeric / total) * 100) : 0;
                const label = (item?.payload as { label?: string } | undefined)?.label ?? '';
                return [`${numeric} (${pct}%)`, label];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {centerLabel}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, flex: 1 }}>
        {data.map((slice) => (
          <Box key={slice.key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '3px',
                bgcolor: slice.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} noWrap>
              {slice.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: CHART_INK.primary }}>
              {slice.value}
            </Typography>
          </Box>
        ))}
        {nonZero.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            {emptyMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DonutStatChart;
