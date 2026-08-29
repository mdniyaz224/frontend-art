# Inventory Management

Covers the Inventory (Product) feature — `src/features/inventory/` and `src/pages/Inventory/`. Follows the same layering as every other feature in this app: `inventoryTypes.ts` → `inventoryApi.ts` → `inventoryThunk.ts` → `inventorySlice.ts` → `inventorySelectors.ts` → `components/` → `pages/Inventory/InventoryListPage.tsx`. See [Staff Management](./staff-management.md) for that pattern spelled out in detail — this doc focuses on what's specific to Inventory.

## Why quantity is never directly editable

be-boiler's `updateProductSchema` never accepts a `quantity` key — `PATCH /products/:id` rejects it outright. Every stock change has to go through `POST /products/:id/adjustments`, which records an immutable audit entry (`delta`, `quantityBefore`/`After`, `reason`, `adjustedBy`, timestamps) rather than just overwriting a number.

The UI enforces this shape directly:

- **Create mode** (`InventoryFormDrawer`, `mode="create"`) has a normal editable `quantity` field — creation is the one place a raw quantity is ever set, matching `POST /products` (`createProductSchema`).
- **Edit mode** replaces that field with a disabled `TextField` showing the current quantity, plus an "Adjust Stock" link underneath. There is no way to type a new quantity into the edit form at all.
- Clicking "Adjust Stock" calls `onRequestAdjustStock`, which `InventoryListPage` wires up to open `AdjustStockDialog` — the sole UI entry point for quantity changes.

## AdjustStockDialog

`src/features/inventory/components/AdjustStockDialog.tsx`. A small dialog, not part of the original Figma design — a necessary, disclosed addition given the constraint above.

- Direction toggle ("Add stock" / "Remove stock") plus a magnitude field combine into a signed `delta` (positive for add, negative for remove) before dispatch — the API only ever takes a signed delta, never a direction+magnitude pair.
- A `reason` field is required (non-empty, trimmed) — the backend requires it for every adjustment, since the ledger entry is meaningless without one.
- The dialog computes and previews the resulting quantity (`currentQuantity + delta`) client-side and blocks submission if it would go negative — a client-side courtesy check; the backend is still the authority and would reject a would-be-negative adjustment on its own.
- On success, dispatches `adjustStockThunk` → `POST /products/:id/adjustments`, which returns both the updated `product` and the new `adjustment` record; the slice updates the product in place in `list`/`selectedProduct`.

## StockAdjustmentHistoryDialog

`src/features/inventory/components/StockAdjustmentHistoryDialog.tsx` — the viewer for the audit trail `AdjustStockDialog` writes to. Without this dialog the ledger would be recorded but invisible anywhere in the UI.

- Reached via the "Stock History" row action in `InventoryTable`, gated by `PERMISSIONS.INVENTORY_ADJUST_STOCK` (matching be-boiler's `GET /:id/adjustments` RBAC — ADMIN/MANAGER only, the same permission used to gate the "Adjust Stock" action itself).
- Fetches `GET /products/:id/adjustments` (paginated) via `fetchStockAdjustmentsThunk` whenever it opens for a given product.
- Table columns: **Date** (`createdAt`), **Change** (the signed `delta`, shown as a green `+N` or red `N` chip), **Before → After** (`quantityBefore → quantityAfter`), **Reason**, and **Adjusted By** (the user who made the change, populated server-side so the UI shows a name/email instead of a bare ID).
- Closing the dialog clears `selectedProduct`/`adjustments` from state (`clearSelectedProduct`) so stale history isn't briefly visible if a different product's history is opened next.

## Low-stock / out-of-stock indicators

be-boiler computes `isInStock` and `isLowStock` as Mongoose virtuals on every `Product` response (derived from `quantity` vs. `lowStockThreshold`); the frontend never recomputes this itself; it just renders whatever the API returns. Two independent places surface it:

1. **`InventoryNameCell`** (the Product column, list view) — the "Stocked Product : N In Stock" subtitle text recolors instead of adding a new badge: default `text.secondary`, `warning.main` when `isLowStock`, `error.main` when `!isInStock`. This keeps the original Figma layout unchanged while still surfacing the signal.
2. **`InventoryTable`**'s **Stock** column — shows the raw `quantity` number plus a `StatusChip` badge next to it: "Out of Stock" (error) when `!isInStock`, "Low Stock" (warning) when `isLowStock` and still in stock, nothing when neither applies.

Both read directly off the same two virtuals, so they can never disagree with each other.

## Search / filter / sort — all server-side

`InventoryListPage` maintains `search` (debounced 400ms) plus a `FilterState` (status, category, stock, unit, minQuantity, priceMin/Max) and a sort field/direction, and sends all of it straight through as `GET /products` query params via `fetchProductList` → `getProductList` (`inventoryApi.ts`). Confirmed there is no client-side `Array.filter`/`.sort` anywhere in `inventoryApi.ts` or the thunks — `buildQueryParams` just serializes whatever's passed, and the returned `list` is rendered as-is. Any change to search/filters/sort resets pagination to page 1 (the previously-selected page may not exist in the new result set).

The filter sidebar's "Product Status" tiles double as a filter control and a live count display (`GET /products/status-summary`, `fetchProductStatusCountsThunk`) — clicking a tile sets `filters.status` and also highlights using the count already fetched for that status, so the counts don't refetch on every filter change.

Category is unusual among the filters: it's populated from `GET /products/categories` (`fetchProductCategoriesThunk`, distinct category values already in the database) rather than a hardcoded enum, and the same list backs the free-text `Autocomplete` in the create/edit form (`CategoryAutocomplete` in `InventoryFormDrawer.tsx`) — so admins can introduce a brand-new category by typing it, with no code change required.

## CRUD summary

| UI action | Component | Thunk | Endpoint |
|---|---|---|---|
| List / search / filter / sort | `InventoryListPage` → `InventoryTable` | `fetchProductList` | `GET /products` |
| Create | `InventoryFormDrawer` (mode `create`) | `createProductThunk` | `POST /products` |
| Edit | `InventoryFormDrawer` (mode `edit`) | `updateProductThunk` | `PATCH /products/:id` |
| Delete | `InventoryTable` row action + confirm dialog | `deleteProductThunk` | `DELETE /products/:id` |
| Adjust stock | `AdjustStockDialog` | `adjustStockThunk` | `POST /products/:id/adjustments` |
| View stock history | `StockAdjustmentHistoryDialog` | `fetchStockAdjustmentsThunk` | `GET /products/:id/adjustments` |

Unlike Staff, Inventory delete is a real hard delete — `PERMISSIONS.INVENTORY_DELETE` gates an actual `DELETE /products/:id`, since `Product` already has `inactive`/`draft` statuses to cover the soft-disable case be-boiler's staff soft-delete otherwise handles via `isActive`.

## Related docs

- [Staff Management](./staff-management.md) — the sibling feature; the shared data-flow pattern is documented there
- [RBAC & Routing](./architecture.md) — how `usePermission` and the permission list are wired up
