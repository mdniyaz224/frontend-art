// ============================================================
// StatusChip — Color-coded Status Indicator
// ============================================================

import React from 'react';
import { Chip, type ChipProps } from '@mui/material';

interface StatusChipProps {
  label: string;
  color?: ChipProps['color'];
  size?: ChipProps['size'];
  variant?: ChipProps['variant'];
}

const StatusChip: React.FC<StatusChipProps> = ({
  label,
  color = 'default',
  size = 'small',
  variant = 'filled',
}) => {
  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 500,
        letterSpacing: '0.02em',
        ...(variant === 'filled' && {
          opacity: 0.9,
        }),
      }}
    />
  );
};

export default React.memo(StatusChip);
