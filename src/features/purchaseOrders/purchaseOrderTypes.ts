// ============================================================
// Purchase Order Types
// ============================================================

import type { BaseEntity } from '../../types/common';

export type PurchaseOrderStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder extends BaseEntity {
  orderNumber: string;
  vendor: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  requestedBy: string;
  approvedBy?: string;
  expectedDeliveryDate?: string;
}

export interface PurchaseOrderFormValues {
  vendor: string;
  items: Omit<PurchaseOrderItem, 'id'>[];
  notes?: string;
  expectedDeliveryDate?: string;
}

export interface PurchaseOrderState {
  list: PurchaseOrder[];
  selectedOrder: PurchaseOrder | null;
  loading: boolean;
  detailLoading: boolean;
  submitting: boolean;
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
