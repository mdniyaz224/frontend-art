import { useMemo } from 'react';
import { useAppSelector } from '../Store/hooks';
import { selectPermissions } from '../features/auth/authSelectors';

export function usePermission(permission: string): boolean {
  const permissions = useAppSelector(selectPermissions);
  return useMemo(() => permissions.includes(permission), [permissions, permission]);
}

export function usePermissions(requiredPermissions: string[]): boolean {
  const permissions = useAppSelector(selectPermissions);
  return useMemo(
    () => requiredPermissions.every((p) => permissions.includes(p)),
    [permissions, requiredPermissions],
  );
}

export function useAnyPermission(requiredPermissions: string[]): boolean {
  const permissions = useAppSelector(selectPermissions);
  return useMemo(
    () => requiredPermissions.some((p) => permissions.includes(p)),
    [permissions, requiredPermissions],
  );
}
