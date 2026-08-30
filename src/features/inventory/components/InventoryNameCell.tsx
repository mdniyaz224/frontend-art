import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import type { Product } from '../inventoryTypes';

interface InventoryNameCellProps {
  product: Product;
}

const InventoryNameCell: React.FC<InventoryNameCellProps> = ({ product }) => {
  const subtitleColor = !product.isInStock
    ? 'error.main'
    : product.isLowStock
      ? 'warning.main'
      : 'text.secondary';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar
        variant="rounded"
        src={product.image}
        sx={{ width: 44, height: 44, bgcolor: 'rgba(255,255,255,0.06)' }}
      >
        <RestaurantRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      </Avatar>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>
        <Typography variant="caption" sx={{ color: subtitleColor }}>
          Stocked Product : {product.quantity} In Stock
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
          {product.sku}
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(InventoryNameCell);
