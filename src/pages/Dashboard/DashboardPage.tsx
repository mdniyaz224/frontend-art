import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import SparklineStatCard from './components/SparklineStatCard';
import PopularDishesCard from './components/PopularDishesCard';
import OverviewChart from './components/OverviewChart';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../utils/constants';
import { SPARKLINE_COLOR, STAT_ICON_COLORS } from './dashboardPalette';
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

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const fullName = useAppSelector(selectUserFullName);

  const canExportReports = usePermission(PERMISSIONS.REPORT_EXPORT);

  const summary = useAppSelector(selectDashboardSummary);
  const summaryLoading = useAppSelector(selectSummaryLoading);
  const popularByQuantity = useAppSelector(selectPopularByQuantity);
  const popularByRevenue = useAppSelector(selectPopularByRevenue);
  const popularLoading = useAppSelector(selectPopularLoading);
  const overviewSeries = useAppSelector(selectOverviewSeries);
  const overviewRange = useAppSelector(selectOverviewRange);
  const overviewLoading = useAppSelector(selectOverviewLoading);

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

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle={
          fullName
            ? `Welcome back, ${fullName} — here's what's happening at COSYPOS today.`
            : "Welcome to COSYPOS — here's what's happening today."
        }
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <SparklineStatCard
            title="Daily Sales"
            value={formatCompactCurrency(summary?.dailySales.value ?? 0)}
            subtitle={summary ? formatDate(summary.dailySales.date, 'D MMMM YYYY') : '—'}
            icon={<PaidRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
            iconColor={STAT_ICON_COLORS.pink}
            sparkline={summary?.dailySales.sparkline ?? []}
            sparklineColor={SPARKLINE_COLOR}
            loading={summaryLoading && !summary}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <SparklineStatCard
            title="Monthly Revenue"
            value={formatCompactCurrency(summary?.monthlyRevenue.value ?? 0)}
            subtitle={summary?.monthlyRevenue.rangeLabel ?? '—'}
            icon={<AccountBalanceWalletRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />}
            iconColor={STAT_ICON_COLORS.navy}
            sparkline={summary?.monthlyRevenue.sparkline ?? []}
            sparklineColor={SPARKLINE_COLOR}
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
            iconColor={STAT_ICON_COLORS.pink}
            sparkline={summary?.tableOccupancy.sparkline ?? []}
            sparklineColor={SPARKLINE_COLOR}
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

      <Grid container spacing={3}>
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
    </Box>
  );
};

export default DashboardPage;
