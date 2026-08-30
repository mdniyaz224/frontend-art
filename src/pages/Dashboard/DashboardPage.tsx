import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import StatCard from './components/StatCard';
import SparklineStatCard from './components/SparklineStatCard';
import PopularDishesCard from './components/PopularDishesCard';
import OverviewChart from './components/OverviewChart';
import DonutStatChart, { type DonutSlice } from './components/DonutStatChart';
import InventoryCategoryChart, { type CategoryDatum } from './components/InventoryCategoryChart';
import NeedsAttentionList from './components/NeedsAttentionList';
import QuickActionsCard from './components/QuickActionsCard';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../utils/constants';
import { CATEGORICAL_SEQUENCE, OVERVIEW_SERIES_COLORS, STATUS_COLORS } from './dashboardPalette';
import { fetchStaffList } from '../../features/staff/staffThunk';
import { selectStaffList, selectStaffLoading, selectStaffPagination } from '../../features/staff/staffSelectors';
import { STAFF_ROLE_OPTIONS } from '../../features/staff/staffTypes';
import { fetchProductList, fetchProductStatusCountsThunk } from '../../features/inventory/inventoryThunk';
import {
  selectProductList,
  selectProductLoading,
  selectProductStatusCounts,
} from '../../features/inventory/inventorySelectors';
import { selectUserFullName } from '../../features/auth/authSelectors';
import { fetchDashboardSummary, fetchPopularDishes, fetchOverview } from '../../features/sales/salesThunk';
import {
  selectDashboardSummary,
  selectSummaryLoading,
  selectPopularByQuantity,
  selectPopularByRevenue,
  selectPopularLoading,
  selectOverviewSeries,
  selectOverviewRange,
  selectOverviewLoading,
} from '../../features/sales/salesSelectors';
import type { OverviewRange } from '../../features/sales/salesTypes';
import { formatCompactCurrency, formatCurrency, formatDate } from '../../utils/formatters';

const AGGREGATE_PAGE_SIZE = 100;

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const fullName = useAppSelector(selectUserFullName);

  const canViewStaff = usePermission(PERMISSIONS.STAFF_VIEW);
  const canViewInventory = usePermission(PERMISSIONS.INVENTORY_VIEW);
  const canExportReports = usePermission(PERMISSIONS.REPORT_EXPORT);

  const summary = useAppSelector(selectDashboardSummary);
  const summaryLoading = useAppSelector(selectSummaryLoading);
  const popularByQuantity = useAppSelector(selectPopularByQuantity);
  const popularByRevenue = useAppSelector(selectPopularByRevenue);
  const popularLoading = useAppSelector(selectPopularLoading);
  const overviewSeries = useAppSelector(selectOverviewSeries);
  const overviewRange = useAppSelector(selectOverviewRange);
  const overviewLoading = useAppSelector(selectOverviewLoading);

  const staffList = useAppSelector(selectStaffList);
  const staffLoading = useAppSelector(selectStaffLoading);
  const staffPagination = useAppSelector(selectStaffPagination);

  const productList = useAppSelector(selectProductList);
  const productLoading = useAppSelector(selectProductLoading);
  const statusCounts = useAppSelector(selectProductStatusCounts);

  useEffect(() => {
    if (canViewStaff) {
      dispatch(fetchStaffList({ page: 1, pageSize: AGGREGATE_PAGE_SIZE, sortBy: 'name', sortOrder: 'asc' }));
    }
  }, [dispatch, canViewStaff]);

  useEffect(() => {
    if (canViewInventory) {
      dispatch(fetchProductList({ page: 1, pageSize: AGGREGATE_PAGE_SIZE, sortBy: 'category', sortOrder: 'asc' }));
      dispatch(fetchProductStatusCountsThunk());
    }
  }, [dispatch, canViewInventory]);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPopularDishes({ sortBy: 'quantity', limit: 4 }));
    dispatch(fetchPopularDishes({ sortBy: 'revenue', limit: 4 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchOverview(overviewRange));
  }, [dispatch, overviewRange]);

  const handleOverviewRangeChange = (range: OverviewRange) => {
    dispatch(fetchOverview(range));
  };

  const handleExportOverview = () => {
    const header = 'period,sales,revenue';
    const rows = overviewSeries.map((point) => `${point.period},${point.sales},${point.revenue}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-overview-${overviewRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const staffByRole: DonutSlice[] = useMemo(
    () =>
      STAFF_ROLE_OPTIONS.map((option, index) => ({
        key: option.value,
        label: option.label,
        value: staffList.filter((s) => s.role === option.value).length,
        color: CATEGORICAL_SEQUENCE[index % CATEGORICAL_SEQUENCE.length],
      })),
    [staffList],
  );

  const productByStatus: DonutSlice[] = useMemo(
    () => [
      { key: 'active', label: 'Active', value: statusCounts?.active ?? 0, color: STATUS_COLORS.good },
      { key: 'draft', label: 'Draft', value: statusCounts?.draft ?? 0, color: STATUS_COLORS.warning },
      { key: 'inactive', label: 'Inactive', value: statusCounts?.inactive ?? 0, color: STATUS_COLORS.neutral },
    ],
    [statusCounts],
  );

  const categoryBreakdown: CategoryDatum[] = useMemo(() => {
    const counts = new Map<string, number>();
    productList.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
  }, [productList]);

  const lowStockCount = useMemo(() => productList.filter((p) => p.isLowStock && p.isInStock).length, [productList]);
  const outOfStockCount = useMemo(() => productList.filter((p) => !p.isInStock).length, [productList]);
  const needsAttention = useMemo(
    () =>
      productList
        .filter((p) => p.isLowStock || !p.isInStock)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 6),
    [productList],
  );

  const totalProducts = statusCounts?.all ?? productList.length;

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle={
          fullName
            ? `Welcome back, ${fullName} — here's what's happening at Foodline today.`
            : "Welcome to Foodline ERP — here's what's happening today."
        }
      />

      {}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <SparklineStatCard
            title="Daily Sales"
            value={formatCompactCurrency(summary?.dailySales.value ?? 0)}
            subtitle={summary ? formatDate(summary.dailySales.date, 'D MMMM YYYY') : '—'}
            icon={<PaidRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
            iconColor={OVERVIEW_SERIES_COLORS.sales}
            sparkline={summary?.dailySales.sparkline ?? []}
            sparklineColor={OVERVIEW_SERIES_COLORS.sales}
            loading={summaryLoading && !summary}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SparklineStatCard
            title="Monthly Revenue"
            value={formatCompactCurrency(summary?.monthlyRevenue.value ?? 0)}
            subtitle={summary?.monthlyRevenue.rangeLabel ?? '—'}
            icon={<AccountBalanceWalletRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
            iconColor={OVERVIEW_SERIES_COLORS.revenue}
            sparkline={summary?.monthlyRevenue.sparkline ?? []}
            sparklineColor={OVERVIEW_SERIES_COLORS.revenue}
            loading={summaryLoading && !summary}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SparklineStatCard
            title="Table Occupancy"
            value={`${summary?.tableOccupancy.totalTables ?? 0} Tables`}
            subtitle={
              summary
                ? `${summary.tableOccupancy.occupiedCount} of ${summary.tableOccupancy.totalTables} occupied (${summary.tableOccupancy.occupancyPercent}%)`
                : '—'
            }
            icon={<TableRestaurantRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
            iconColor={CATEGORICAL_SEQUENCE[0]}
            sparkline={summary?.tableOccupancy.sparkline ?? []}
            sparklineColor={CATEGORICAL_SEQUENCE[0]}
            loading={summaryLoading && !summary}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <PopularDishesCard
            title="Top Dishes — By Orders"
            dishes={popularByQuantity}
            subLine={(dish) => `Order: ${dish.quantitySold} sold`}
            loading={popularLoading && popularByQuantity.length === 0}
            emptyMessage="No orders yet."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PopularDishesCard
            title="Top Dishes — By Revenue"
            dishes={popularByRevenue}
            subLine={(dish) => `Revenue: ${formatCurrency(dish.revenue)}`}
            loading={popularLoading && popularByRevenue.length === 0}
            emptyMessage="No orders yet."
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <OverviewChart
            data={overviewSeries}
            range={overviewRange}
            onRangeChange={handleOverviewRangeChange}
            onExport={handleExportOverview}
            canExport={canExportReports}
            loading={overviewLoading && overviewSeries.length === 0}
          />
        </Grid>
      </Grid>

      {(canViewStaff || canViewInventory) && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Team &amp; Inventory
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {canViewStaff && (
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Staff"
              value={staffPagination.totalItems}
              caption="Active team members"
              icon={<BadgeRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />}
              color="#6366f1"
              loading={staffLoading && staffList.length === 0}
            />
          </Grid>
        )}
        {canViewInventory && (
          <>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Inventory Items"
                value={totalProducts}
                caption="Products tracked"
                icon={<Inventory2RoundedIcon sx={{ color: '#fff', fontSize: 28 }} />}
                color="#0ea5e9"
                loading={productLoading && productList.length === 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Low Stock"
                value={lowStockCount}
                caption="Below alert threshold"
                icon={<WarningAmberRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />}
                color="#f59e0b"
                loading={productLoading && productList.length === 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Out of Stock"
                value={outOfStockCount}
                caption="Needs restocking"
                icon={<RemoveShoppingCartRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />}
                color="#ff4b4b"
                loading={productLoading && productList.length === 0}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {canViewStaff && (
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Staff by Role
                </Typography>
                <DonutStatChart data={staffByRole} centerLabel="Staff" emptyMessage="No staff records yet." />
              </CardContent>
            </Card>
          </Grid>
        )}
        {canViewInventory && (
          <>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Products by Status
                  </Typography>
                  <DonutStatChart
                    data={productByStatus}
                    centerLabel="Products"
                    emptyMessage="No products yet."
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Inventory by Category
                  </Typography>
                  <InventoryCategoryChart data={categoryBreakdown} />
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        {canViewInventory && (
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Needs Attention
                </Typography>
                <NeedsAttentionList products={needsAttention} />
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item xs={12} md={canViewInventory ? 4 : 12}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Actions
              </Typography>
              <QuickActionsCard />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
