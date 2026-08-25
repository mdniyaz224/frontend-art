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
    setLogs(state, action: PayloadAction<MaintenanceLog[]>) {
      state.logs = action.payload;
    },
  },
});

export const { setLogs } = maintenanceLogsSlice.actions;
export default maintenanceLogsSlice.reducer;
