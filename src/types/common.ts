// ============================================================
// Common Type Definitions Shared Across Features
// ============================================================

/**
 * Base entity — all persisted models extend this.
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generic select/dropdown option.
 */
export interface SelectOption {
  label: string;
  value: string | number;
}

/**
 * User permission string literal.
 * Format: MODULE_ACTION (e.g., AIRCRAFT_CREATE, PURCHASE_ORDER_EDIT)
 */
export type Permission = string;

/**
 * User role definition.
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

/**
 * Sidebar / navigation menu item.
 */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  permission?: Permission;
  children?: NavItem[];
}

/**
 * Breadcrumb segment.
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

/**
 * Tab definition for tabbed layouts.
 */
export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * Status option for status-based filters / chips.
 */
export interface StatusOption {
  label: string;
  value: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

/**
 * Column definition for the generic DataTable component.
 */
export interface DataTableColumn<T> {
  id: string;
  label: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

/**
 * Action button definition for DataTable row actions.
 */
export interface DataTableAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  show?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}
