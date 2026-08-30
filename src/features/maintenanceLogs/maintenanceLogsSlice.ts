import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MaintenanceLog, MaintenanceLogState } from './maintenanceLogTypes';

const initialState: MaintenanceLogState = {
  logs: [],
  loading: false,
};

const maintenanceLogsSlice = createSlice({
  name: 'maintenances',
  initialState,
  reducers: {
    // No thunk dispatches this yet — the backend has no maintenance concept
    // at all, so this slice is local-only state for now.
    setLogs(state, action: PayloadAction<MaintenanceLog[]>) {
      state.logs = action.payload;
    },
  },
});

export const { setLogs } = maintenanceLogsSlice.actions;
export default maintenanceLogsSlice.reducer;
