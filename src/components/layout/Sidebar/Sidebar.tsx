// ============================================================
// Sidebar — Collapsible Navigation Drawer
// ============================================================

import React, { useMemo } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  alpha,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FlightRoundedIcon from '@mui/icons-material/FlightRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import { useAppSelector } from '../../../Store/hooks';
import { selectPermissions } from '../../../features/auth/authSelectors';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, HEADER_HEIGHT, PERMISSIONS } from '../../../utils/constants';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
}

const MENU_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon />, permission: PERMISSIONS.DASHBOARD_VIEW },
  { id: 'aircraft', label: 'Aircraft', path: '/aircraft', icon: <FlightRoundedIcon />, permission: PERMISSIONS.AIRCRAFT_VIEW },
  { id: 'users', label: 'Users', path: '/users', icon: <PeopleRoundedIcon />, permission: PERMISSIONS.USER_VIEW },
  { id: 'purchase-orders', label: 'Purchase Orders', path: '/purchase-orders', icon: <ShoppingCartRoundedIcon />, permission: PERMISSIONS.PURCHASE_ORDER_VIEW },
  { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: <BuildRoundedIcon />, permission: PERMISSIONS.MAINTENANCE_VIEW },

];

interface SidebarProps {
  desktopOpen: boolean;
  mobileOpen: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ desktopOpen, mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = useAppSelector(selectPermissions);

  const visibleItems = useMemo(() => {
    return MENU_ITEMS.filter(
      (item) => !item.permission || permissions.includes(item.permission),
    );
  }, [permissions]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderDrawerContent = (open: boolean) => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          px: open ? 3 : 0,
          justifyContent: open ? 'flex-start' : 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
            O
          </Typography>
        </Box>
        {open && (
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              AeroFleet
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
              ERP System
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2, px: open ? 1.5 : 0.5 }}>
        <List component="nav" disablePadding>
          {visibleItems.map((item) => {
            const active = isActive(item.path);
            const button = (
              <ListItemButton
                key={item.id}
                selected={active}
                onClick={() => {
                  navigate(item.path);
                  onMobileClose?.();
                }}
                sx={{
                  minHeight: 44,
                  px: open ? 2 : 0,
                  justifyContent: open ? 'flex-start' : 'center',
                  borderRadius: '10px',
                  mx: open ? 0 : 0.5,
                  mb: 0.5,
                  ...(active && {
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      color: 'primary.main',
                    },
                  }),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 0,
                    justifyContent: 'center',
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        variant: 'body2',
                        sx: { fontWeight: active ? 600 : 400 },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            );

            return open ? (
              <React.Fragment key={item.id}>{button}</React.Fragment>
            ) : (
              <Tooltip key={item.id} title={item.label} placement="right" arrow>
                {button}
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      {open && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            © {new Date().getFullYear()} AeroFleet ERP
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile drawer — always renders its expanded content; only its
          visibility (via `open`) is toggled. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
          },
        }}
      >
        {renderDrawerContent(true)}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: desktopOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
            transition: 'width 0.25s ease',
            overflowX: 'hidden',
          },
        }}
        open
      >
        {renderDrawerContent(desktopOpen)}
      </Drawer>
    </>
  );
};

export default React.memo(Sidebar);
