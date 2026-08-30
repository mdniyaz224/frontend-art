import type { BaseEntity } from '../../types/common';
import type { PaginationMeta } from '../../types/api';

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

  isInStock: boolean;
  isLowStock: boolean;
}

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

  adjustedBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryState {
  list: Product[];
  selectedProduct: Product | null;
  categories: string[];
  statusCounts: ProductStatusCounts | null;
  adjustments: StockAdjustment[];
  adjustmentsPagination: PaginationMeta;
  loading: boolean;
  detailLoading: boolean;
  submitting: boolean;
  adjusting: boolean;
  adjustmentsLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
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

export const PRODUCT_SORT_FIELDS = ['name', 'price', 'quantity', 'category', 'createdAt'] as const;
