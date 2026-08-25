// ============================================================
// Purchase Order Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPurchaseOrderList, getPurchaseOrderById } from './purchaseOrderApi';
import { getApiErrorMessage } from '../../utils/helpers';
import type { PurchaseOrder } from './purchaseOrderTypes';
import type { ListQueryParams, PaginatedResponse } from '../../types/api';

export const fetchPurchaseOrderList = createAsyncThunk<PaginatedResponse<PurchaseOrder>, ListQueryParams>(
  'purchaseOrders/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      return await getPurchaseOrderList(params);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchPurchaseOrderById = createAsyncThunk<PurchaseOrder, string>(
  'purchaseOrders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getPurchaseOrderById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);
