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
