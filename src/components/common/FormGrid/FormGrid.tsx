import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const TwoColGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

export const FullWidthField = styled(Box)({
  gridColumn: '1 / -1',
});
