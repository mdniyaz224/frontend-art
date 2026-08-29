// ============================================================
// Maintenance Log Redux Slice
// ============================================================

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
    // No thunk/API file dispatches this yet — be-boiler has no maintenance concept at
    // all (no route, controller, or model), so this slice is currently local-only state.
    setLogs(state, action: PayloadAction<MaintenanceLog[]>) {
      state.logs = action.payload;
    },
  },
});

export const { setLogs } = maintenanceLogsSlice.actions;
export default maintenanceLogsSlice.reducer;
