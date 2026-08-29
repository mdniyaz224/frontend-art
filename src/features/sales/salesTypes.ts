// ============================================================
// Sales / Dashboard Analytics Types
// ============================================================
// Mirrors be-boiler's dashboard.service.ts + dashboard.validator.ts response
// shapes exactly (GET /dashboard/summary, /popular-dishes, /overview).

export interface SparklinePoint {
  label: string;
  value: number;
}

export interface DailySalesStat {
  value: number;
  date: string;
  sparkline: SparklinePoint[];
}

export interface MonthlyRevenueStat {
  value: number;
  rangeLabel: string;
  sparkline: SparklinePoint[];
}

export interface TableOccupancyStat {
  occupiedCount: number;
  totalTables: number;
  occupancyPercent: number;
  sparkline: SparklinePoint[];
}

export interface DashboardSummary {
  dailySales: DailySalesStat;
  monthlyRevenue: MonthlyRevenueStat;
  tableOccupancy: TableOccupancyStat;
}

export type PopularDishesSortBy = 'quantity' | 'revenue';

export interface PopularDish {
  productId: string;
  name: string;
  image?: string;
  price: number;
  isInStock: boolean;
  quantitySold: number;
  revenue: number;
}

export type OverviewRange = 'daily' | 'weekly' | 'monthly';

export interface OverviewPoint {
  period: string;
  sales: number;
  revenue: number;
}

export interface SalesState {
  summary: DashboardSummary | null;
  summaryLoading: boolean;
  popularByQuantity: PopularDish[];
  popularByRevenue: PopularDish[];
  popularLoading: boolean;
  overview: OverviewPoint[];
  overviewRange: OverviewRange;
  overviewLoading: boolean;
  error: string | null;
}
