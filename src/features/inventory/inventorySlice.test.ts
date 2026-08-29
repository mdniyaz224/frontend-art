import { describe, it, expect } from 'vitest';
import reducer, { clearInventoryError, clearSelectedProduct } from './inventorySlice';
import {
  fetchProductList,
  updateProductThunk,
  deleteProductThunk,
  fetchProductCategoriesThunk,
  fetchProductStatusCountsThunk,
  adjustStockThunk,
} from './inventoryThunk';
import { DEFAULT_PAGINATION } from '../../types/api';
import type { InventoryState, Product } from './inventoryTypes';

const initialState: InventoryState = {
  list: [],
  selectedProduct: null,
  categories: [],
  statusCounts: null,
  adjustments: [],
  adjustmentsPagination: DEFAULT_PAGINATION,
  loading: false,
  detailLoading: false,
  submitting: false,
  adjusting: false,
  error: null,
  pagination: DEFAULT_PAGINATION,
};

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'Chicken Parmesan',
  sku: 'CHI-00001',
  category: 'Chicken',
  price: 55,
  quantity: 10,
  unit: 'piece',
  status: 'active',
  perishable: true,
  isInStock: true,
  isLowStock: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('inventorySlice reducers', () => {
  it('clears the error', () => {
    const state = reducer({ ...initialState, error: 'oops' }, clearInventoryError());
    expect(state.error).toBeNull();
  });

  it('clears the selected product and its adjustment history', () => {
    const product = makeProduct();
    const state = reducer(
      {
        ...initialState,
        selectedProduct: product,
        adjustments: [
          {
            id: 'a1',
            product: product.id,
            productNameSnapshot: product.name,
            productSkuSnapshot: product.sku,
            delta: 5,
            quantityBefore: 5,
            quantityAfter: 10,
            reason: 'test',
            adjustedBy: 'u1',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
      clearSelectedProduct(),
    );
    expect(state.selectedProduct).toBeNull();
    expect(state.adjustments).toEqual([]);
  });
});

describe('inventorySlice extraReducers: fetchProductList', () => {
  it('sets loading on pending', () => {
    const state = reducer(initialState, fetchProductList.pending('reqId', {} as never));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores the list and adapts backend pagination on fulfilled', () => {
    const product = makeProduct();
    const state = reducer(
      { ...initialState, loading: true },
      fetchProductList.fulfilled(
        { products: [product], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } },
        'reqId',
        {} as never,
      ),
    );
    expect(state.loading).toBe(false);
    expect(state.list).toEqual([product]);
    expect(state.pagination).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('stores the error message on rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchProductList.rejected(new Error('network'), 'reqId', {} as never, 'Network error'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});

describe('inventorySlice extraReducers: updateProductThunk', () => {
  it('updates the product in place without touching quantity', () => {
    const product = makeProduct({ id: '42', price: 55 });
    const updated = { ...product, price: 60 };
    const state = reducer(
      { ...initialState, list: [product], selectedProduct: product, submitting: true },
      updateProductThunk.fulfilled(updated, 'reqId', { id: '42', data: {} as never }),
    );
    expect(state.submitting).toBe(false);
    expect(state.list[0].price).toBe(60);
    expect(state.list[0].quantity).toBe(10);
  });
});

describe('inventorySlice extraReducers: deleteProductThunk', () => {
  it('removes the deleted product from the list and clears selection', () => {
    const product = makeProduct({ id: '42' });
    const state = reducer(
      { ...initialState, list: [product], selectedProduct: product, submitting: true },
      deleteProductThunk.fulfilled('42', 'reqId', '42'),
    );
    expect(state.submitting).toBe(false);
    expect(state.list).toEqual([]);
    expect(state.selectedProduct).toBeNull();
  });
});

describe('inventorySlice extraReducers: categories and status counts', () => {
  it('stores fetched categories', () => {
    const state = reducer(initialState, fetchProductCategoriesThunk.fulfilled(['Chicken', 'Beverage'], 'reqId', undefined));
    expect(state.categories).toEqual(['Chicken', 'Beverage']);
  });

  it('stores fetched status counts', () => {
    const counts = { all: 10, active: 7, inactive: 2, draft: 1 };
    const state = reducer(initialState, fetchProductStatusCountsThunk.fulfilled(counts, 'reqId', undefined));
    expect(state.statusCounts).toEqual(counts);
  });
});

describe('inventorySlice extraReducers: adjustStockThunk', () => {
  it('updates the product quantity in place after a stock adjustment', () => {
    const product = makeProduct({ id: '42', quantity: 10 });
    const adjusted = { ...product, quantity: 30 };
    const state = reducer(
      { ...initialState, list: [product], selectedProduct: product, adjusting: true },
      adjustStockThunk.fulfilled(adjusted, 'reqId', { id: '42', delta: 20, reason: 'Received shipment' }),
    );
    expect(state.adjusting).toBe(false);
    expect(state.list[0].quantity).toBe(30);
    expect(state.selectedProduct?.quantity).toBe(30);
  });

  it('stores the error message on rejected (e.g. negative-stock guard)', () => {
    const state = reducer(
      { ...initialState, adjusting: true },
      adjustStockThunk.rejected(
        new Error('bad'),
        'reqId',
        { id: '42', delta: -1000, reason: 'test' },
        'Adjustment would result in negative stock',
      ),
    );
    expect(state.adjusting).toBe(false);
    expect(state.error).toBe('Adjustment would result in negative stock');
  });
});
