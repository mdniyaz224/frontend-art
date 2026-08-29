// ============================================================
// usePermission Hook
// ============================================================

import { useMemo } from 'react';
import { useAppSelector } from '../Store/hooks';
import { selectPermissions } from '../features/auth/authSelectors';

/**
 * Check if the current user has a specific permission.
 *
 * @example
 * const canEdit = usePermission('STAFF_EDIT');
 * if (canEdit) { ... }
 */
export function usePermission(permission: string): boolean {
  const permissions = useAppSelector(selectPermissions);
  return useMemo(() => permissions.includes(permission), [permissions, permission]);
}

/**
 * Check if the current user has ALL of the specified permissions.
 */
export function usePermissions(requiredPermissions: string[]): boolean {
  const permissions = useAppSelector(selectPermissions);
  return useMemo(
    () => requiredPermissions.every((p) => permissions.includes(p)),
    [permissions, requiredPermissions],
  );
}

/**
 * Check if the current user has ANY of the specified permissions.
 */
export function useAnyPermission(requiredPermissions: string[]): boolean {
  const permissions = useAppSelector(selectPermissions);
  return useMemo(
    () => requiredPermissions.some((p) => permissions.includes(p)),
    [permissions, requiredPermissions],
  );
}
