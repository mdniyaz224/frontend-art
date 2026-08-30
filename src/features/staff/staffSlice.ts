import { createSlice } from '@reduxjs/toolkit';
import type { StaffState } from './staffTypes';
import { DEFAULT_PAGINATION } from '../../types/api';
import {
  fetchStaffList,
  fetchStaffById,
  createStaffThunk,
  updateStaffThunk,
  toggleStaffActiveThunk,
  assignStaffRoleThunk,
} from './staffThunk';

const initialState: StaffState = {
  list: [],
  selectedStaff: null,
  loading: false,
  detailLoading: false,
  submitting: false,
  error: null,
  pagination: DEFAULT_PAGINATION,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearStaffError(state) {
      state.error = null;
    },
    clearSelectedStaff(state) {
      state.selectedStaff = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.staff;

        const { page, limit, total, totalPages } = action.payload.pagination;
        state.pagination = {
          page,
          pageSize: limit,
          totalItems: total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        };
      })
      .addCase(fetchStaffList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch staff';
      });

    builder
      .addCase(fetchStaffById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedStaff = action.payload;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch staff member';
      });

    builder
      .addCase(createStaffThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createStaffThunk.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createStaffThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to create staff member';
      });

    builder
      .addCase(updateStaffThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateStaffThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.selectedStaff = action.payload;
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateStaffThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to update staff member';
      });

    builder
      .addCase(toggleStaffActiveThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(toggleStaffActiveThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.selectedStaff = action.payload;
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(toggleStaffActiveThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to update staff status';
      });

    builder
      .addCase(assignStaffRoleThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(assignStaffRoleThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.selectedStaff = action.payload;
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(assignStaffRoleThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to update staff role';
      });
  },
});

export const { clearStaffError, clearSelectedStaff } = staffSlice.actions;
export default staffSlice.reducer;
