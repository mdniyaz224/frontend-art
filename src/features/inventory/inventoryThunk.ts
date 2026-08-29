// ============================================================
// Inventory Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductList,
  getProductById,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  getProductCategories,
  getProductStatusCounts,
  adjustStock as adjustStockApi,
  getStockAdjustments,
  type InventoryListParams,
  type InventoryListData,
  type StockAdjustmentListData,
} from './inventoryApi';
import { getApiErrorMessage } from '../../utils/helpers';
import type {
  Product,
  ProductCreateFormValues,
  ProductStatusCounts,
  ProductUpdateFormValues,
} from './inventoryTypes';

export const fetchProductList = createAsyncThunk<InventoryListData, InventoryListParams>(
  'inventory/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getProductList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchProductById = createAsyncThunk<Product, string>(
  'inventory/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProductById(id);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const createProductThunk = createAsyncThunk<Product, ProductCreateFormValues>(
  'inventory/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createProductApi(data);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const updateProductThunk = createAsyncThunk<
  Product,
  { id: string; data: ProductUpdateFormValues }
>('inventory/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateProductApi(id, data);
    return response.data.product;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const deleteProductThunk = createAsyncThunk<string, string>(
  'inventory/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchProductCategoriesThunk = createAsyncThunk<string[], void>(
  'inventory/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductCategories();
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchProductStatusCountsThunk = createAsyncThunk<ProductStatusCounts, void>(
  'inventory/fetchStatusCounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductStatusCounts();
      return response.data.counts;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const adjustStockThunk = createAsyncThunk<
  Product,
  { id: string; delta: number; reason: string }
>('inventory/adjustStock', async ({ id, delta, reason }, { rejectWithValue }) => {
  try {
    const response = await adjustStockApi(id, delta, reason);
    return response.data.product;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const fetchStockAdjustmentsThunk = createAsyncThunk<
  StockAdjustmentListData,
  { id: string; page: number; limit: number }
>('inventory/fetchAdjustments', async ({ id, page, limit }, { rejectWithValue }) => {
  try {
    const response = await getStockAdjustments(id, { page, limit });
    return response.data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});
