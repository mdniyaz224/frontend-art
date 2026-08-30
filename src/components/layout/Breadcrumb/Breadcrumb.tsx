import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useNavigate } from 'react-router-dom';
import type { BreadcrumbItem } from '../../../types/common';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs
      separator={<NavigateNextRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />}
      sx={{ '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.path) {
          return (
            <Typography
              key={item.label}
              variant="body2"
              sx={{
                color: isLast ? 'text.primary' : 'text.secondary',
                fontWeight: isLast ? 500 : 400,
              }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={item.label}
            component="button"
            variant="body2"
            underline="hover"
            color="text.secondary"
            onClick={() => navigate(item.path!)}
            sx={{ cursor: 'pointer' }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default React.memo(Breadcrumb);
