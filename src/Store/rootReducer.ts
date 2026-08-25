// ============================================================
// Root Reducer — combines all feature slices
// ============================================================

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import aircraftReducer from '../features/aircraft/aircraftSlice';
import userReducer from '../features/users/userSlice';
import purchaseOrderReducer from '../features/purchaseOrders/purchaseOrderSlice';
import maintenanceReducer from '../features/maintenanceLogs/maintenanceLogsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  aircraft: aircraftReducer,
  maintenances: maintenanceReducer,
  users: userReducer,
  purchaseOrders: purchaseOrderReducer,
});

export default rootReducer;
