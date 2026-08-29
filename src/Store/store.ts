// ============================================================
// Redux Store Configuration
// ============================================================

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Empty on purpose — no slice currently stores non-serializable
        // values; add an entry here rather than disabling the check globally.
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
