// ============================================================
// MainLayout — App Shell with Sidebar + Header + Content
// ============================================================

import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, HEADER_HEIGHT } from '../../../utils/constants';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Desktop: collapses the permanent drawer to a mini-width rail.
  const [desktopOpen, setDesktopOpen] = useState(true);
  // Mobile: shows/hides the temporary (modal) drawer — must default to
  // closed, since an "open" modal drawer aria-hides the rest of the app
  // even while it's CSS-hidden on larger viewports.
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setDesktopOpen((prev) => !prev);
    }
  }, [isMobile]);

  const handleCloseMobileSidebar = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        desktopOpen={desktopOpen}
        mobileOpen={mobileOpen}
        onMobileClose={handleCloseMobileSidebar}
      />
      <Header sidebarOpen={desktopOpen} onToggleSidebar={handleToggleSidebar} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            md: `calc(100% - ${desktopOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}px)`,
          },
          ml: {
            md: `${desktopOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}px`,
          },
          mt: `${HEADER_HEIGHT}px`,
          p: { xs: 2, sm: 3 },
          transition: 'width 0.25s ease, margin-left 0.25s ease',
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
