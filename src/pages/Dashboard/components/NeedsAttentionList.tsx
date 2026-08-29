// ============================================================
// NeedsAttentionList — real low-stock / out-of-stock products
// ============================================================
// Replaces the original boilerplate's fully-fabricated "Activity Feed"
// (hardcoded "Ada Admin adjusted the weekend shift schedule..." copy with
// no data behind it). Status is never color-alone here — every row pairs
// the status color with an icon and a text chip label.

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import { STATUS_COLORS } from '../dashboardPalette';
import type { Product } from '../../../features/inventory/inventoryTypes';

interface NeedsAttentionListProps {
  products: Product[];
}

const NeedsAttentionList: React.FC<NeedsAttentionListProps> = ({ products }) => {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
        <CheckCircleRoundedIcon sx={{ color: STATUS_COLORS.good }} />
        <Typography variant="body2" color="text.secondary">
          All products are adequately stocked.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {products.map((product) => {
        const outOfStock = !product.isInStock;
        const color = outOfStock ? STATUS_COLORS.critical : STATUS_COLORS.warning;
        return (
          <Box
            key={product.id}
            onClick={() => navigate('/inventory')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.25,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
            }}
          >
            {outOfStock ? (
              <RemoveShoppingCartRoundedIcon sx={{ color, fontSize: 20, flexShrink: 0 }} />
            ) : (
              <WarningAmberRoundedIcon sx={{ color, fontSize: 20, flexShrink: 0 }} />
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {product.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {product.category} · {product.quantity} {product.unit}
                {product.quantity === 1 ? '' : 's'} left
              </Typography>
            </Box>
            <Chip
              size="small"
              label={outOfStock ? 'Out of Stock' : 'Low Stock'}
              sx={{
                bgcolor: `${color}22`,
                color,
                fontWeight: 700,
                flexShrink: 0,
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default NeedsAttentionList;
