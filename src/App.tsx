// ============================================================
// App.tsx — Root Application Component
// ============================================================

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './Store/store';
import theme from './theme/theme';
import AppRoutes from './routes/AppRoutes';
import { setupInterceptors } from './services/interceptors';
import { getCurrentUser } from './features/auth/authThunk';
import { setInitialized } from './features/auth/authSlice';
import { getAccessToken } from './services/interceptors';

// Setup Axios interceptors once at app startup
setupInterceptors();

/**
 * AuthInitializer — restores session from stored token on app load.
 */
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      store.dispatch(getCurrentUser());
    } else {
      store.dispatch(setInitialized());
    }
  }, []);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthInitializer>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
