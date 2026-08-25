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
    const wrapper = renderWithPermissions(['AIRCRAFT_VIEW']);
    const { result } = renderHook(() => usePermission('AIRCRAFT_VIEW'), { wrapper });
    expect(result.current).toBe(true);
  });

  it('returns false when the user lacks the permission', () => {
    const wrapper = renderWithPermissions(['AIRCRAFT_VIEW']);
    const { result } = renderHook(() => usePermission('AIRCRAFT_EDIT'), { wrapper });
    expect(result.current).toBe(false);
  });
});

describe('usePermissions', () => {
  it('requires every listed permission to be present', () => {
    const wrapper = renderWithPermissions(['AIRCRAFT_VIEW', 'AIRCRAFT_EDIT']);
    const { result } = renderHook(
      () => usePermissions(['AIRCRAFT_VIEW', 'AIRCRAFT_EDIT']),
      { wrapper },
    );
    expect(result.current).toBe(true);
  });

  it('fails when any listed permission is missing', () => {
    const wrapper = renderWithPermissions(['AIRCRAFT_VIEW']);
    const { result } = renderHook(
      () => usePermissions(['AIRCRAFT_VIEW', 'AIRCRAFT_EDIT']),
      { wrapper },
    );
    expect(result.current).toBe(false);
  });
});

describe('useAnyPermission', () => {
  it('passes when at least one listed permission is present', () => {
    const wrapper = renderWithPermissions(['AIRCRAFT_EDIT']);
    const { result } = renderHook(
      () => useAnyPermission(['AIRCRAFT_VIEW', 'AIRCRAFT_EDIT']),
      { wrapper },
    );
    expect(result.current).toBe(true);
  });
});
