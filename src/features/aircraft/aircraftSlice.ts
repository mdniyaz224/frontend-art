// ============================================================
// Aircraft Redux Slice
// ============================================================

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AircraftState, AircraftFilter } from './aircraftTypes';
import { DEFAULT_PAGINATION } from '../../types/api';
import {
  fetchAircraftList,
  fetchAircraftById,
  createAircraftThunk,
  updateAircraftThunk,
  deleteAircraftThunk,
} from './aircraftThunk';

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

const aircraftSlice = createSlice({
  name: 'aircraft',
  initialState,
  reducers: {
    setAircraftFilters(state, action: PayloadAction<AircraftFilter>) {
      state.filters = action.payload;
    },
    clearAircraftError(state) {
      state.error = null;
    },
    clearSelectedAircraft(state) {
      state.selectedAircraft = null;
    },
  },
  extraReducers: (builder) => {
    // ---- Fetch List ----
    builder
      .addCase(fetchAircraftList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAircraftList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAircraftList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch aircraft';
      });

    // ---- Fetch By ID ----
    builder
      .addCase(fetchAircraftById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchAircraftById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedAircraft = action.payload;
      })
      .addCase(fetchAircraftById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch aircraft';
      });

    // ---- Create ----
    builder
      .addCase(createAircraftThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createAircraftThunk.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createAircraftThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to create aircraft';
      });

    // ---- Update ----
    builder
      .addCase(updateAircraftThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateAircraftThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.selectedAircraft = action.payload;
        // Also update in the list if present
        const index = state.list.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateAircraftThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to update aircraft';
      });

    // ---- Delete ----
    builder
      .addCase(deleteAircraftThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteAircraftThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.list = state.list.filter((a) => a.id !== action.payload);
        if (state.selectedAircraft?.id === action.payload) {
          state.selectedAircraft = null;
        }
      })
      .addCase(deleteAircraftThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to delete aircraft';
      });
  },
});

export const { setAircraftFilters, clearAircraftError, clearSelectedAircraft } =
  aircraftSlice.actions;
export default aircraftSlice.reducer;
