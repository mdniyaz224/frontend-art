// ============================================================
// Aircraft Selectors
// ============================================================

import type { RootState } from '../../Store/store';

export const selectAircraftList = (state: RootState) => state.aircraft.list;
export const selectAircraftLoading = (state: RootState) => state.aircraft.loading;
export const selectAircraftDetailLoading = (state: RootState) => state.aircraft.detailLoading;
export const selectAircraftSubmitting = (state: RootState) => state.aircraft.submitting;
export const selectAircraftError = (state: RootState) => state.aircraft.error;
export const selectAircraftPagination = (state: RootState) => state.aircraft.pagination;
export const selectSelectedAircraft = (state: RootState) => state.aircraft.selectedAircraft;
export const selectAircraftFilters = (state: RootState) => state.aircraft.filters;
