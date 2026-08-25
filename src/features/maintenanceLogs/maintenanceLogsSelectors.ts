// ============================================================
// Maintenance Log Selectors
// ============================================================

import type { RootState } from '../../Store/store';

export const selectMaintenanceLogs = (state: RootState) => state.maintenances.logs;
export const selectMaintenanceLogsLoading = (state: RootState) => state.maintenances.loading;
