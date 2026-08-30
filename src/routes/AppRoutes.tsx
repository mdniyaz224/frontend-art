import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import PermissionRoute from './PermissionRoute';
import { protectedRoutes } from './routeConfig';
import LoginPage from '../pages/Login/LoginPage';
import LoadingOverlay from '../components/common/LoadingOverlay/LoadingOverlay';

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay fullScreen message="Loading page..." />}>
      <Routes>
        {}
        <Route path="/login" element={<LoginPage />} />

        {}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map((route) => {
            const Element = route.element;
            const content = route.permission ? (
              <PermissionRoute permission={route.permission}>
                <Element />
              </PermissionRoute>
            ) : (
              <Element />
            );

            return <Route key={route.path} path={route.path} element={content} />;
          })}
        </Route>

        {}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
