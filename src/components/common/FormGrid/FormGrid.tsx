// ============================================================
// FormGrid — shared 2-column form layout primitives
// ============================================================
// Used by both Staff and Inventory's Add/Edit slide-in panels.

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Two-column field grid — matches the Add/Edit panel design.
export const TwoColGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

// Makes a grid child span every column of its parent grid
export const FullWidthField = styled(Box)({
  gridColumn: '1 / -1',
});
