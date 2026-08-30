import { createApiThunk } from '../../utils/createApiThunk';
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
import type {
  Product,
  ProductCreateFormValues,
  ProductStatusCounts,
  ProductUpdateFormValues,
} from './inventoryTypes';

export const fetchProductList = createApiThunk<InventoryListData, InventoryListParams>(
  'inventory/fetchList',
  async (params) => {
    const response = await getProductList(params);
    return response.data;
  },
);

export const fetchProductById = createApiThunk<Product, string>('inventory/fetchById', async (id) => {
  const response = await getProductById(id);
  return response.data.product;
});

export const createProductThunk = createApiThunk<Product, ProductCreateFormValues>(
  'inventory/create',
  async (data) => {
    const response = await createProductApi(data);
    return response.data.product;
  },
);

export const updateProductThunk = createApiThunk<
  Product,
  { id: string; data: ProductUpdateFormValues }
>('inventory/update', async ({ id, data }) => {
  const response = await updateProductApi(id, data);
  return response.data.product;
});

export const deleteProductThunk = createApiThunk<string, string>('inventory/delete', async (id) => {
  await deleteProductApi(id);
  return id;
});

export const fetchProductCategoriesThunk = createApiThunk<string[], void>(
  'inventory/fetchCategories',
  async () => {
    const response = await getProductCategories();
    return response.data.categories;
  },
);

export const fetchProductStatusCountsThunk = createApiThunk<ProductStatusCounts, void>(
  'inventory/fetchStatusCounts',
  async () => {
    const response = await getProductStatusCounts();
    return response.data.counts;
  },
);

export const adjustStockThunk = createApiThunk<
  Product,
  { id: string; delta: number; reason: string }
>('inventory/adjustStock', async ({ id, delta, reason }) => {
  const response = await adjustStockApi(id, delta, reason);
  return response.data.product;
});

export const fetchStockAdjustmentsThunk = createApiThunk<
  StockAdjustmentListData,
  { id: string; page: number; limit: number }
>('inventory/fetchAdjustments', async ({ id, page, limit }) => {
  const response = await getStockAdjustments(id, { page, limit });
  return response.data;
});
