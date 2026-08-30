import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, HEADER_HEIGHT } from '../../../utils/constants';
import { PageTitleProvider } from '../../../contexts/PageTitleContext';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [desktopOpen, setDesktopOpen] = useState(true);

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
    <PageTitleProvider>
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
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </PageTitleProvider>
  );
};

export default MainLayout;
