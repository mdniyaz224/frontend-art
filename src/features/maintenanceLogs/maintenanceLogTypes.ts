// ============================================================
// Maintenance Log Types
// ============================================================

export type MaintenanceLogStatus = 'open' | 'closed';

export interface MaintenanceLog {
  id: string;
  assetId: string;
  description: string;
  status: MaintenanceLogStatus;
  createdAt: string;
}

export interface MaintenanceLogState {
  logs: MaintenanceLog[];
  loading: boolean;
}
