import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../Store/hooks';
import { selectCurrentUser, selectUserFullName } from '../../../features/auth/authSelectors';
import { logout } from '../../../features/auth/authThunk';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, HEADER_HEIGHT } from '../../../utils/constants';
import { getInitials } from '../../../utils/formatters';
import { usePageTitleValue } from '../../../contexts/PageTitleContext';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, onToggleSidebar }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const fullName = useAppSelector(selectUserFullName);
  const { title: pageTitle, showBack } = usePageTitleValue();
  const isBackNav = !!pageTitle && showBack;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    dispatch(logout());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: {
          md: `calc(100% - ${sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}px)`,
        },
        ml: {
          md: `${sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}px`,
        },
        height: HEADER_HEIGHT,

        transition: 'width 0.25s ease, margin-left 0.25s ease',
      }}
    >
      <Toolbar sx={{ height: HEADER_HEIGHT }}>
        <IconButton
          edge="start"
          onClick={isBackNav ? () => navigate(-1) : onToggleSidebar}
          sx={{
            mr: isBackNav ? 1 : 2,
            color: 'text.primary',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        >
          {isBackNav ? <ChevronLeftRoundedIcon /> : <MenuRoundedIcon />}
        </IconButton>
        {pageTitle && (
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {pageTitle}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {}
        <Tooltip title="Notifications">
          <IconButton sx={{ mr: 1, color: 'text.secondary', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}>
            <Badge
              badgeContent={3}
              color="error"
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(0.8)', opacity: 0.5 },
                    '50%': { transform: 'scale(1.2)', opacity: 1 },
                    '100%': { transform: 'scale(0.8)', opacity: 0.5 },
                  }
                }
              }}
            >
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1.5, my: 1 }} />

        {}
        <Tooltip title="Account">
          <IconButton onClick={handleOpenMenu} sx={{ p: 0.5, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user ? getInitials(user.name) : ''}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <PersonOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <SettingsRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Header);
