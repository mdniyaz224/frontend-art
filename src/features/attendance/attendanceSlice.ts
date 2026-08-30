import { createSlice } from '@reduxjs/toolkit';
import type { AttendanceState } from './attendanceTypes';
import { attendanceKey } from './attendanceTypes';
import { fetchAttendanceForDate, markAttendanceThunk } from './attendanceThunk';

const initialState: AttendanceState = {
  entries: {},
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceForDate.pending, (state, action) => {
        const key = attendanceKey(action.meta.arg.staffId, action.meta.arg.date);
        state.entries[key] = { status: null, loading: true, error: null };
      })
      .addCase(fetchAttendanceForDate.fulfilled, (state, action) => {
        const key = attendanceKey(action.payload.staffId, action.payload.date);
        state.entries[key] = { status: action.payload.status, loading: false, error: null };
      })
      .addCase(fetchAttendanceForDate.rejected, (state, action) => {
        const key = attendanceKey(action.meta.arg.staffId, action.meta.arg.date);
        state.entries[key] = {
          status: null,
          loading: false,
          error: (action.payload as string) || 'Failed to fetch attendance',
        };
      });

    builder
      .addCase(markAttendanceThunk.pending, (state, action) => {
        const key = attendanceKey(action.meta.arg.staffId, action.meta.arg.date);
        state.entries[key] = {
          status: state.entries[key]?.status ?? null,
          loading: true,
          error: null,
        };
      })
      .addCase(markAttendanceThunk.fulfilled, (state, action) => {
        const key = attendanceKey(action.payload.staffId, action.payload.date);
        state.entries[key] = { status: action.payload.status, loading: false, error: null };
      })
      .addCase(markAttendanceThunk.rejected, (state, action) => {
        const key = attendanceKey(action.meta.arg.staffId, action.meta.arg.date);
        state.entries[key] = {
          status: state.entries[key]?.status ?? null,
          loading: false,
          error: (action.payload as string) || 'Failed to mark attendance',
        };
      });
  },
});

export default attendanceSlice.reducer;
