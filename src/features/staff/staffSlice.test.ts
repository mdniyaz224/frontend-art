import { describe, it, expect } from 'vitest';
import reducer, { clearStaffError, clearSelectedStaff } from './staffSlice';
import { fetchStaffList, toggleStaffActiveThunk } from './staffThunk';
import { DEFAULT_PAGINATION } from '../../types/api';
import type { Staff, StaffState } from './staffTypes';

const initialState: StaffState = {
  list: [],
  selectedStaff: null,
  loading: false,
  detailLoading: false,
  submitting: false,
  error: null,
  pagination: DEFAULT_PAGINATION,
};

const makeStaff = (overrides: Partial<Staff> = {}): Staff => ({
  id: '1',
  name: 'Ada Admin',
  email: 'ada@example.com',
  role: 'admin',
  phone: '+15551234567',
  salary: 50000,
  dateOfBirth: '1990-01-01T00:00:00.000Z',
  shiftStart: '09:00',
  shiftEnd: '17:00',
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('staffSlice reducers', () => {
  it('clears the error', () => {
    const state = reducer({ ...initialState, error: 'oops' }, clearStaffError());
    expect(state.error).toBeNull();
  });

  it('clears the selected staff member', () => {
    const staff = makeStaff();
    const state = reducer({ ...initialState, selectedStaff: staff }, clearSelectedStaff());
    expect(state.selectedStaff).toBeNull();
  });
});

describe('staffSlice extraReducers: fetchStaffList', () => {
  it('sets loading on pending', () => {
    const state = reducer(initialState, fetchStaffList.pending('reqId', {} as never));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores the list and adapts backend pagination on fulfilled', () => {
    const staff = makeStaff();
    const state = reducer(
      { ...initialState, loading: true },
      fetchStaffList.fulfilled(
        { staff: [staff], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } },
        'reqId',
        {} as never,
      ),
    );
    expect(state.loading).toBe(false);
    expect(state.list).toEqual([staff]);
    expect(state.pagination).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('stores the error message on rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchStaffList.rejected(new Error('network'), 'reqId', {} as never, 'Network error'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});

describe('staffSlice extraReducers: toggleStaffActiveThunk', () => {
  it('updates the staff member in place after deactivation', () => {
    const staff = makeStaff({ id: '42', isActive: true });
    const deactivated = { ...staff, isActive: false };
    const state = reducer(
      { ...initialState, list: [staff], selectedStaff: staff, submitting: true },
      toggleStaffActiveThunk.fulfilled(deactivated, 'reqId', { id: '42', isActive: true }),
    );
    expect(state.submitting).toBe(false);
    expect(state.list[0].isActive).toBe(false);
    expect(state.selectedStaff?.isActive).toBe(false);
  });
});
