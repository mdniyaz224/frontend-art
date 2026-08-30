import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import staffReducer from '../features/staff/staffSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import salesReducer from '../features/sales/salesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  staff: staffReducer,
  attendance: attendanceReducer,
  inventory: inventoryReducer,
  sales: salesReducer,
});

export default rootReducer;
