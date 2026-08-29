import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import rootReducer from '../Store/rootReducer';
import authReducer from '../features/auth/authSlice';
import { usePermission, usePermissions, useAnyPermission } from './usePermission';

function renderWithPermissions(permissions: string[]) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      auth: { ...authReducer(undefined, { type: '@@init' }), permissions },
    },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return wrapper;
}

describe('usePermission', () => {
  it('returns true when the user has the permission', () => {
    const wrapper = renderWithPermissions(['STAFF_VIEW']);
    const { result } = renderHook(() => usePermission('STAFF_VIEW'), { wrapper });
    expect(result.current).toBe(true);
  });

  it('returns false when the user lacks the permission', () => {
    const wrapper = renderWithPermissions(['STAFF_VIEW']);
    const { result } = renderHook(() => usePermission('STAFF_EDIT'), { wrapper });
    expect(result.current).toBe(false);
  });
});

describe('usePermissions', () => {
  it('requires every listed permission to be present', () => {
    const wrapper = renderWithPermissions(['STAFF_VIEW', 'STAFF_EDIT']);
    const { result } = renderHook(
      () => usePermissions(['STAFF_VIEW', 'STAFF_EDIT']),
      { wrapper },
    );
    expect(result.current).toBe(true);
  });

  it('fails when any listed permission is missing', () => {
    const wrapper = renderWithPermissions(['STAFF_VIEW']);
    const { result } = renderHook(
      () => usePermissions(['STAFF_VIEW', 'STAFF_EDIT']),
      { wrapper },
    );
    expect(result.current).toBe(false);
  });
});

describe('useAnyPermission', () => {
  it('passes when at least one listed permission is present', () => {
    const wrapper = renderWithPermissions(['STAFF_EDIT']);
    const { result } = renderHook(
      () => useAnyPermission(['STAFF_VIEW', 'STAFF_EDIT']),
      { wrapper },
    );
    expect(result.current).toBe(true);
  });
});
