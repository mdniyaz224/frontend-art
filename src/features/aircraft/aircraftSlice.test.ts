import { describe, it, expect } from 'vitest';
import reducer, {
  setAircraftFilters,
  clearAircraftError,
  clearSelectedAircraft,
} from './aircraftSlice';
import { fetchAircraftList, deleteAircraftThunk } from './aircraftThunk';
import { DEFAULT_PAGINATION } from '../../types/api';
import type { Aircraft, AircraftState } from './aircraftTypes';

const initialState: AircraftState = {
  list: [],
  selectedAircraft: null,
  loading: false,
  detailLoading: false,
  submitting: false,
  error: null,
  pagination: DEFAULT_PAGINATION,
  filters: {},
};

const makeAircraft = (overrides: Partial<Aircraft> = {}): Aircraft => ({
  id: '1',
  registrationNumber: 'N12345',
  model: '737 MAX',
  manufacturer: 'Boeing',
  serialNumber: 'SN-1',
  status: 'ACTIVE',
  yearOfManufacture: 2020,
  totalFlightHours: 1000,
  lastMaintenanceDate: null,
  nextMaintenanceDate: null,
  capacity: 180,
  engineType: 'CFM56',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('aircraftSlice reducers', () => {
  it('sets filters', () => {
    const state = reducer(initialState, setAircraftFilters({ search: 'boeing' }));
    expect(state.filters).toEqual({ search: 'boeing' });
  });

  it('clears the error', () => {
    const state = reducer({ ...initialState, error: 'oops' }, clearAircraftError());
    expect(state.error).toBeNull();
  });

  it('clears the selected aircraft', () => {
    const aircraft = makeAircraft();
    const state = reducer(
      { ...initialState, selectedAircraft: aircraft },
      clearSelectedAircraft(),
    );
    expect(state.selectedAircraft).toBeNull();
  });
});

describe('aircraftSlice extraReducers: fetchAircraftList', () => {
  it('sets loading on pending', () => {
    const state = reducer(initialState, fetchAircraftList.pending('reqId', {}));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores the list and pagination on fulfilled', () => {
    const aircraft = makeAircraft();
    const pagination = { ...DEFAULT_PAGINATION, totalItems: 1, totalPages: 1 };
    const state = reducer(
      { ...initialState, loading: true },
      fetchAircraftList.fulfilled(
        { success: true, data: [aircraft], pagination },
        'reqId',
        {},
      ),
    );
    expect(state.loading).toBe(false);
    expect(state.list).toEqual([aircraft]);
    expect(state.pagination).toEqual(pagination);
  });

  it('stores the error message on rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchAircraftList.rejected(new Error('network'), 'reqId', {}, 'Network error'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});

describe('aircraftSlice extraReducers: deleteAircraftThunk', () => {
  it('removes the deleted aircraft from the list and clears selection', () => {
    const aircraft = makeAircraft({ id: '42' });
    const state = reducer(
      { ...initialState, list: [aircraft], selectedAircraft: aircraft, submitting: true },
      deleteAircraftThunk.fulfilled('42', 'reqId', '42'),
    );
    expect(state.submitting).toBe(false);
    expect(state.list).toEqual([]);
    expect(state.selectedAircraft).toBeNull();
  });

  it('leaves unrelated aircraft in the list untouched', () => {
    const kept = makeAircraft({ id: 'keep-me' });
    const removed = makeAircraft({ id: 'remove-me' });
    const state = reducer(
      { ...initialState, list: [kept, removed] },
      deleteAircraftThunk.fulfilled('remove-me', 'reqId', 'remove-me'),
    );
    expect(state.list).toEqual([kept]);
  });
});
