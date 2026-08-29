// ============================================================
// Route Configuration — Centralized Route Definitions
// ============================================================

import { lazy } from 'react';
import { PERMISSIONS } from '../utils/constants';

// Lazy-loaded pages
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const StaffListPage = lazy(() => import('../pages/Staff/StaffListPage'));
const StaffDetailPage = lazy(() => import('../pages/Staff/StaffDetailPage'));
const InventoryListPage = lazy(() => import('../pages/Inventory/InventoryListPage'));
const UsersPage = lazy(() => import('../pages/Users/UsersPage'));
const MaintenancePage = lazy(() => import('../pages/Maintenance/MaintenancePage'));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.FC>;
  permission?: string;
  label: string;
}

/**
 * Authenticated routes — all require login.
 * Permission field is optional — if set, the user must have that permission.
 */
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: DashboardPage,
    label: 'Dashboard',
  },
  // Staff
  {
    path: '/staff',
    element: StaffListPage,
    permission: PERMISSIONS.STAFF_VIEW,
    label: 'Staff',
  },
  {
    path: '/staff/:id',
    element: StaffDetailPage,
    permission: PERMISSIONS.STAFF_VIEW,
    label: 'Staff Details',
  },
  // Inventory
  {
    path: '/inventory',
    element: InventoryListPage,
    permission: PERMISSIONS.INVENTORY_VIEW,
    label: 'Inventory',
  },
  // Users
  {
    path: '/users',
    element: UsersPage,
    permission: PERMISSIONS.USER_VIEW,
    label: 'Users',
  },
  // Maintenance
  {
    path: '/maintenance',
    element: MaintenancePage,
    permission: PERMISSIONS.MAINTENANCE_VIEW,
    label: 'Maintenance',
  },
];
