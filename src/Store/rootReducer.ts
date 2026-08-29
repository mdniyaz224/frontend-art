// ============================================================
// Root Reducer — combines all feature slices
// ============================================================

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import staffReducer from '../features/staff/staffSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import userReducer from '../features/users/userSlice';
import maintenanceReducer from '../features/maintenanceLogs/maintenanceLogsSlice';
import salesReducer from '../features/sales/salesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  staff: staffReducer,
  attendance: attendanceReducer,
  inventory: inventoryReducer,
  // Key is `maintenances`, not `maintenanceLogs` — matches the feature's
  // own selectors (maintenanceLogsSelectors.ts), which read state.maintenances.
  maintenances: maintenanceReducer,
  users: userReducer,
  sales: salesReducer,
});

export default rootReducer;
