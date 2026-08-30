import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import InventoryTable from '../../features/inventory/components/InventoryTable';
import InventoryFormDrawer from '../../features/inventory/components/InventoryFormDrawer';
import AdjustStockDialog from '../../features/inventory/components/AdjustStockDialog';
import StockAdjustmentHistoryDialog from '../../features/inventory/components/StockAdjustmentHistoryDialog';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  selectProductList,
  selectProductLoading,
  selectProductError,
  selectProductPagination,
  selectProductSubmitting,
  selectProductCategories,
  selectProductStatusCounts,
} from '../../features/inventory/inventorySelectors';
import {
  fetchProductList,
  deleteProductThunk,
  fetchProductCategoriesThunk,
  fetchProductStatusCountsThunk,
} from '../../features/inventory/inventoryThunk';
import { usePermission } from '../../hooks/usePermission';
import { useDebounce } from '../../hooks/useDebounce';
import { PERMISSIONS, SEARCH_DEBOUNCE_MS } from '../../utils/constants';
import { pastelPinkButtonSx, PASTEL_PINK_ACCENT } from '../../theme/accents';
import { usePageTitle } from '../../contexts/PageTitleContext';
import { PRODUCT_UNIT_OPTIONS } from '../../features/inventory/inventoryTypes';
import type { Product, ProductStatus, ProductUnit } from '../../features/inventory/inventoryTypes';

interface FilterState {
  status: ProductStatus | '';
  category: string;
  stock: 'instock' | 'outofstock' | '';
  unit: ProductUnit | '';
  minQuantity: string;
  priceMin: string;
  priceMax: string;
}

const EMPTY_FILTERS: FilterState = {
  status: '',
  category: '',
  stock: '',
  unit: '',
  minQuantity: '',
  priceMin: '',
  priceMax: '',
};

const STATUS_TILES: { key: 'all' | ProductStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'draft', label: 'Draft' },
];

const InventoryListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  usePageTitle('Inventory');
  const canCreate = usePermission(PERMISSIONS.INVENTORY_CREATE);
  const canAdjustStock = usePermission(PERMISSIONS.INVENTORY_ADJUST_STOCK);

  const list = useAppSelector(selectProductList);
  const loading = useAppSelector(selectProductLoading);
  const error = useAppSelector(selectProductError);
  const pagination = useAppSelector(selectProductPagination);
  const submitting = useAppSelector(selectProductSubmitting);
  const categories = useAppSelector(selectProductCategories);
  const statusCounts = useAppSelector(selectProductStatusCounts);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [drawerState, setDrawerState] = useState<{ mode: 'create' | 'edit'; productId: string | null } | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);
  const [historyTarget, setHistoryTarget] = useState<Product | null>(null);

  const editingProduct =
    drawerState?.mode === 'edit' ? (list.find((p) => p.id === drawerState.productId) ?? null) : null;

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const loadData = useCallback(
    (page = 1) => {
      dispatch(
        fetchProductList({
          page,
          pageSize: pagination.pageSize,
          sortBy,
          sortOrder,
          search: debouncedSearch || undefined,
          category: filters.category || undefined,
          status: filters.status || undefined,
          unit: filters.unit || undefined,
          stock: filters.stock || undefined,
          minQuantity: filters.minQuantity ? Number(filters.minQuantity) : undefined,
          priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
          priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
        }),
      );
    },
    [dispatch, pagination.pageSize, sortBy, sortOrder, debouncedSearch, filters],
  );

  useEffect(() => {
    loadData(1);
  }, [debouncedSearch, filters, sortBy, sortOrder]);

  useEffect(() => {
    dispatch(fetchProductCategoriesThunk());
    dispatch(fetchProductStatusCountsThunk());
  }, [dispatch]);

  const refreshAll = useCallback(() => {
    loadData(pagination.page);
    dispatch(fetchProductCategoriesThunk());
    dispatch(fetchProductStatusCountsThunk());
  }, [dispatch, loadData, pagination.page]);

  const handlePageChange = useCallback((page: number) => loadData(page), [loadData]);
  const handlePageSizeChange = useCallback(
    (pageSize: number) =>
      dispatch(
        fetchProductList({
          page: 1,
          pageSize,
          sortBy,
          sortOrder,
          search: debouncedSearch || undefined,
          category: filters.category || undefined,
          status: filters.status || undefined,
          unit: filters.unit || undefined,
          stock: filters.stock || undefined,
          minQuantity: filters.minQuantity ? Number(filters.minQuantity) : undefined,
          priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
          priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
        }),
      ),
    [dispatch, sortBy, sortOrder, debouncedSearch, filters],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteProductThunk(deleteTarget.id));
    if (deleteProductThunk.fulfilled.match(result)) {
      setDeleteTarget(null);
      refreshAll();
    }
  }, [deleteTarget, dispatch, refreshAll]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {pagination.totalItems} total products
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setDrawerState({ mode: 'create', productId: null })}
            sx={pastelPinkButtonSx}
          >
            Add New Inventory
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {}
        <Box sx={{ width: 260, flexShrink: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Product Status
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2.5 }}>
            {STATUS_TILES.map((tile) => {
              const selected = (filters.status || 'all') === tile.key;
              const count =
                tile.key === 'all' ? statusCounts?.all : statusCounts?.[tile.key as ProductStatus];
              return (
                <Box
                  key={tile.key}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, status: tile.key === 'all' ? '' : tile.key }))
                  }
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: selected ? PASTEL_PINK_ACCENT : 'transparent',
                    cursor: 'pointer',
                    bgcolor: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <Typography variant="body2">{tile.label}</Typography>
                  {typeof count === 'number' &&
                    (selected ? (
                      <Box
                        sx={{
                          px: 0.75,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          bgcolor: PASTEL_PINK_ACCENT,
                          color: '#1a1625',
                        }}
                      >
                        {count}
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {count}
                      </Typography>
                    ))}
                </Box>
              );
            })}
          </Box>

          <Typography component="label" htmlFor="category-filter" variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
            Category
          </Typography>
          <TextField
            id="category-filter"
            select
            fullWidth
            size="small"
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            slotProps={{ select: { displayEmpty: true } }}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <Typography component="label" htmlFor="stock-filter" variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
            Stock
          </Typography>
          <TextField
            id="stock-filter"
            select
            fullWidth
            size="small"
            value={filters.stock}
            onChange={(e) => setFilters((prev) => ({ ...prev, stock: e.target.value as FilterState['stock'] }))}
            slotProps={{ select: { displayEmpty: true } }}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="instock">In Stock</MenuItem>
            <MenuItem value="outofstock">Out of Stock</MenuItem>
          </TextField>

          <Typography component="label" htmlFor="unit-filter" variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
            Value
          </Typography>
          <TextField
            id="unit-filter"
            select
            fullWidth
            size="small"
            value={filters.unit}
            onChange={(e) => setFilters((prev) => ({ ...prev, unit: e.target.value as FilterState['unit'] }))}
            slotProps={{ select: { displayEmpty: true } }}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            {PRODUCT_UNIT_OPTIONS.map((u) => (
              <MenuItem key={u.value} value={u.value}>
                {u.label}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500 }}>
            Piece / Item / Quantity
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder="Minimum quantity"
            value={filters.minQuantity}
            onChange={(e) => setFilters((prev) => ({ ...prev, minQuantity: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500 }}>
            Price
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
            sx={{ mb: 1 }}
            slotProps={{ input: { endAdornment: <InputAdornment position="end">$</InputAdornment> } }}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
            sx={{ mb: 2.5 }}
            slotProps={{ input: { endAdornment: <InputAdornment position="end">$</InputAdornment> } }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={pastelPinkButtonSx}
            onClick={() => {
              setFilters(EMPTY_FILTERS);
              setSearch('');
            }}
          >
            Reset Filters
          </Button>
        </Box>

        {}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products by name or SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <InventoryTable
            data={list}
            loading={loading}
            error={error}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(field) => {
              setSortBy(field);
              setSortOrder((prev) => (sortBy === field && prev === 'asc' ? 'desc' : 'asc'));
            }}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={(product) => setDrawerState({ mode: 'edit', productId: product.id })}
            onDelete={(product) => setDeleteTarget(product)}
            onViewHistory={(product) => setHistoryTarget(product)}
            onRetry={() => loadData(pagination.page)}
          />
        </Box>
      </Box>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={submitting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <InventoryFormDrawer
        open={!!drawerState}
        mode={drawerState?.mode || 'create'}
        product={editingProduct}
        onClose={() => setDrawerState(null)}
        onSuccess={refreshAll}
        onRequestAdjustStock={canAdjustStock ? (product) => setAdjustTarget(product) : undefined}
      />

      <AdjustStockDialog
        open={!!adjustTarget}
        product={adjustTarget}
        onClose={() => setAdjustTarget(null)}
        onSuccess={refreshAll}
      />

      <StockAdjustmentHistoryDialog
        open={!!historyTarget}
        product={historyTarget}
        onClose={() => setHistoryTarget(null)}
      />
    </Box>
  );
};

export default InventoryListPage;
