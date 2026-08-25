// ============================================================
// Aircraft Types
// ============================================================

import type { BaseEntity } from '../../types/common';

export type AircraftStatus = 'ACTIVE' | 'IN_MAINTENANCE' | 'GROUNDED' | 'RETIRED' | 'IN_SERVICE';

export interface Aircraft extends BaseEntity {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  status: AircraftStatus;
  yearOfManufacture: number;
  totalFlightHours: number;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
  capacity: number;
  engineType: string;
  notes?: string;
}

export interface AircraftFormValues {
  registrationNumber: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  status: AircraftStatus;
  yearOfManufacture: number;
  totalFlightHours: number;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
  capacity: number;
  engineType: string;
  notes?: string;
}

export interface AircraftFilter {
  search?: string;
  status?: AircraftStatus | '';
  manufacturer?: string;
}

export interface AircraftState {
  list: Aircraft[];
  selectedAircraft: Aircraft | null;
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
  filters: AircraftFilter;
}

export const AIRCRAFT_STATUS_OPTIONS: { label: string; value: AircraftStatus; color: 'success' | 'warning' | 'error' | 'info' | 'default' }[] = [
  { label: 'Active', value: 'ACTIVE', color: 'success' },
  { label: 'In Service', value: 'IN_SERVICE', color: 'success' },
  { label: 'In Maintenance', value: 'IN_MAINTENANCE', color: 'warning' },
  { label: 'Grounded', value: 'GROUNDED', color: 'error' },
  { label: 'Retired', value: 'RETIRED', color: 'default' },
];
