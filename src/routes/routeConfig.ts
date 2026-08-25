// ============================================================
// Route Configuration — Centralized Route Definitions
// ============================================================

import { lazy } from 'react';
import { PERMISSIONS } from '../utils/constants';

// Lazy-loaded pages
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const AircraftListPage = lazy(() => import('../pages/Aircraft/AircraftListPage'));
const AircraftCreatePage = lazy(() => import('../pages/Aircraft/AircraftCreatePage'));
const AircraftEditPage = lazy(() => import('../pages/Aircraft/AircraftEditPage'));
const AircraftDetailPage = lazy(() => import('../pages/Aircraft/AircraftDetailPage'));
const UsersPage = lazy(() => import('../pages/Users/UsersPage'));
const PurchaseOrdersPage = lazy(() => import('../pages/PurchaseOrders/PurchaseOrdersPage'));
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
  // Aircraft
  {
    path: '/aircraft',
    element: AircraftListPage,
    permission: PERMISSIONS.AIRCRAFT_VIEW,
    label: 'Aircraft',
  },
  {
    path: '/aircraft/new',
    element: AircraftCreatePage,
    permission: PERMISSIONS.AIRCRAFT_CREATE,
    label: 'Create Aircraft',
  },
  {
    path: '/aircraft/:id/edit',
    element: AircraftEditPage,
    permission: PERMISSIONS.AIRCRAFT_EDIT,
    label: 'Edit Aircraft',
  },
  {
    path: '/aircraft/:id',
    element: AircraftDetailPage,
    permission: PERMISSIONS.AIRCRAFT_VIEW,
    label: 'Aircraft Details',
  },
  // Users
  {
    path: '/users',
    element: UsersPage,
    permission: PERMISSIONS.USER_VIEW,
    label: 'Users',
  },
  // Purchase Orders
  {
    path: '/purchase-orders',
    element: PurchaseOrdersPage,
    permission: PERMISSIONS.PURCHASE_ORDER_VIEW,
    label: 'Purchase Orders',
  },
  // Maintenance
  {
    path: '/maintenance',
    element: MaintenancePage,
    permission: PERMISSIONS.MAINTENANCE_VIEW,
    label: 'Maintenance',
  },
];
