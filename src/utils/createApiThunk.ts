// ============================================================
// createApiThunk — Redux Thunk Factory for API Calls
// ============================================================
// Every feature thunk was hand-rolling the same
// try { ... } catch (error) { return rejectWithValue(getApiErrorMessage(error)) }
// wrapper around createAsyncThunk. This factory captures that once so a
// thunk body only needs to describe the API call itself.
//
// `onError` is an escape hatch for the few thunks that need a side effect
// on failure (e.g. clearing the stored access token) — it runs before the
// value is rejected.

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApiErrorMessage } from './helpers';

export function createApiThunk<Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (arg: ThunkArg) => Promise<Returned>,
  options?: { onError?: (error: unknown) => void },
) {
  return createAsyncThunk<Returned, ThunkArg, { rejectValue: string }>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        return await payloadCreator(arg);
      } catch (error) {
        options?.onError?.(error);
        return rejectWithValue(getApiErrorMessage(error));
      }
    },
  );
}
