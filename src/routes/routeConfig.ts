import { lazy } from 'react';
import { PERMISSIONS } from '../utils/constants';

const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const StaffListPage = lazy(() => import('../pages/Staff/StaffListPage'));
const StaffDetailPage = lazy(() => import('../pages/Staff/StaffDetailPage'));
const InventoryListPage = lazy(() => import('../pages/Inventory/InventoryListPage'));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.FC>;
  permission?: string;
  label: string;
}

export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: DashboardPage,
    label: 'Dashboard',
  },

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

  {
    path: '/inventory',
    element: InventoryListPage,
    permission: PERMISSIONS.INVENTORY_VIEW,
    label: 'Inventory',
  },
];
