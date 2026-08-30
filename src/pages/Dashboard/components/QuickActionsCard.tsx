import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/constants';

interface QuickAction {
  label: string;
  to: string;
  permission: string;
  icon: React.ReactNode;
  color: string;
}

const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();
  const canCreateStaff = usePermission(PERMISSIONS.STAFF_CREATE);
  const canViewStaff = usePermission(PERMISSIONS.STAFF_VIEW);
  const canCreateInventory = usePermission(PERMISSIONS.INVENTORY_CREATE);
  const canViewInventory = usePermission(PERMISSIONS.INVENTORY_VIEW);

  const candidates: (QuickAction | false)[] = [
    canCreateStaff && {
      label: 'Add Staff Member',
      to: '/staff',
      permission: PERMISSIONS.STAFF_CREATE,
      icon: <PersonAddAlt1RoundedIcon sx={{ fontSize: 20 }} />,
      color: '#6366f1',
    },
    canViewStaff && {
      label: 'View Staff Directory',
      to: '/staff',
      permission: PERMISSIONS.STAFF_VIEW,
      icon: <GroupsRoundedIcon sx={{ fontSize: 20 }} />,
      color: '#0ea5e9',
    },
    canCreateInventory && {
      label: 'Add Inventory Item',
      to: '/inventory',
      permission: PERMISSIONS.INVENTORY_CREATE,
      icon: <AddBoxRoundedIcon sx={{ fontSize: 20 }} />,
      color: '#10b981',
    },
    canViewInventory && {
      label: 'View Inventory',
      to: '/inventory',
      permission: PERMISSIONS.INVENTORY_VIEW,
      icon: <Inventory2RoundedIcon sx={{ fontSize: 20 }} />,
      color: '#f59e0b',
    },
  ];
  const actions = candidates.filter((a): a is QuickAction => Boolean(a));

  if (actions.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {actions.map((action) => (
        <Box
          key={action.label}
          onClick={() => navigate(action.to)}
          sx={{
            p: 2.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(action.color, 0.15)} 0%, ${alpha(action.color, 0.05)} 100%)`,
            border: `1px solid ${alpha(action.color, 0.2)}`,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            '&:hover': {
              transform: 'scale(1.02) translateX(4px)',
              border: `1px solid ${alpha(action.color, 1)}`,
              boxShadow: `0 4px 12px ${alpha(action.color, 0.15)}`,
            },
          }}
        >
          <Box sx={{ color: action.color, display: 'flex' }}>{action.icon}</Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', flex: 1 }}>
            {action.label}
          </Typography>
          <Typography variant="body2" sx={{ color: action.color }}>
            →
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default QuickActionsCard;
