export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export type Permission = string;

export type StaffRole = 'admin' | 'manager' | 'cashier';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  permission?: Permission;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface StatusOption {
  label: string;
  value: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

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

export interface DataTableAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  show?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}
