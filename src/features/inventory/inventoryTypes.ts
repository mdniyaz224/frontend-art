// ============================================================
// Inventory (Product) Types
// ============================================================
// Mirrors be-boiler's Product + StockAdjustment models and validators
// exactly (src/models/product.model.ts, stockAdjustment.model.ts,
// src/validators/product.validator.ts).

import type { BaseEntity } from '../../types/common';

export type ProductStatus = 'active' | 'inactive' | 'draft';
export type ProductUnit = 'piece' | 'kg' | 'litre' | 'dozen' | 'box';

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  unit: ProductUnit;
  status: ProductStatus;
  perishable: boolean;
  lowStockThreshold?: number;
  image?: string;
  /** Mongoose virtuals — always present in API responses. */
  isInStock: boolean;
  isLowStock: boolean;
}

/** Fields accepted by POST /products (createProductSchema). Includes the
 * initial quantity — this is the only place quantity is ever set directly. */
export interface ProductCreateFormValues {
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: ProductUnit;
  status: ProductStatus;
  perishable: boolean;
  lowStockThreshold?: number;
  image?: string;
}

/** Fields accepted by PATCH /products/:id (updateProductSchema) — no quantity
 * or SKU; quantity changes only ever go through POST /:id/adjustments. */
export interface ProductUpdateFormValues {
  name: string;
  category: string;
  price: number;
  unit: ProductUnit;
  status: ProductStatus;
  perishable: boolean;
  lowStockThreshold?: number;
  image?: string;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  status?: ProductStatus | '';
  unit?: ProductUnit | '';
  stock?: 'instock' | 'outofstock' | '';
  minQuantity?: number;
  priceMin?: number;
  priceMax?: number;
}

export interface ProductStatusCounts {
  all: number;
  active: number;
  inactive: number;
  draft: number;
}

/** Raw pagination shape returned by GET /products and GET /:id/adjustments. */
export interface InventoryApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StockAdjustment {
  id: string;
  product: string;
  productNameSnapshot: string;
  productSkuSnapshot: string;
  delta: number;
  quantityBefore: number;
  quantityAfter: number;
  reason: string;
  adjustedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryState {
  list: Product[];
  selectedProduct: Product | null;
  categories: string[];
  statusCounts: ProductStatusCounts | null;
  adjustments: StockAdjustment[];
  adjustmentsPagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  loading: boolean;
  detailLoading: boolean;
  submitting: boolean;
  adjusting: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const PRODUCT_STATUS_OPTIONS: { label: string; value: ProductStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Draft', value: 'draft' },
];

export const PRODUCT_UNIT_OPTIONS: { label: string; value: ProductUnit }[] = [
  { label: 'Piece', value: 'piece' },
  { label: 'Kg', value: 'kg' },
  { label: 'Litre', value: 'litre' },
  { label: 'Dozen', value: 'dozen' },
  { label: 'Box', value: 'box' },
];

/** Matches PRODUCT_SORT_FIELDS in be-boiler's product.validator.ts. */
export const PRODUCT_SORT_FIELDS = ['name', 'price', 'quantity', 'category', 'createdAt'] as const;
