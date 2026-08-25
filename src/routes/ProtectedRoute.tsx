// ============================================================
// ProtectedRoute — Requires Authentication
// ============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../Store/hooks';
import { selectIsAuthenticated, selectAuthInitializing } from '../features/auth/authSelectors';
import LoadingOverlay from '../components/common/LoadingOverlay/LoadingOverlay';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const initializing = useAppSelector(selectAuthInitializing);
  const location = useLocation();

  // Still checking auth status
  if (initializing) {
    return <LoadingOverlay fullScreen message="Initializing..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
