import React from 'react';
import { Avatar, Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import { STATUS_COLORS } from '../dashboardPalette';
import { formatCurrency } from '../../../utils/formatters';
import type { PopularDish } from '../../../features/sales/salesTypes';

interface PopularDishesCardProps {
  title: string;
  dishes: PopularDish[];
  subLine: (dish: PopularDish) => string;
  loading?: boolean;
  emptyMessage: string;
}

const PopularDishesCard: React.FC<PopularDishesCardProps> = ({ title, dishes, subLine, loading, emptyMessage }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 600 }}>
            See All
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={56} />
            ))}
          </Box>
        ) : dishes.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {dishes.map((dish) => (
              <Box
                key={dish.productId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Avatar variant="rounded" src={dish.image} sx={{ width: 44, height: 44, flexShrink: 0 }}>
                  <RestaurantMenuRoundedIcon />
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {dish.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {subLine(dish)}
                  </Typography>
                </Box>
                <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontWeight: 700, color: dish.isInStock ? STATUS_COLORS.good : STATUS_COLORS.critical }}
                  >
                    {dish.isInStock ? 'In Stock' : 'Out of Stock'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(dish.price)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PopularDishesCard;
