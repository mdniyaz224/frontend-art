# Architecture

## Folder structure

```
src/
├── features/          One folder per domain: auth, staff, attendance, inventory,
│                       users, maintenanceLogs — see "Feature layering" below.
├── components/
│   ├── common/         Generic, feature-agnostic UI (DataTable, forms, dialogs...).
│   └── layout/          App chrome (MainLayout, Breadcrumb, sidebar, header).
├── pages/               One folder per route surface (Dashboard, Staff, Inventory,
│                       Users, Maintenance, Login) — thin composition of a feature's
│                       slice + shared components. Wired up in routes/routeConfig.ts.
├── routes/               AppRoutes.tsx (renderer), routeConfig.ts (route table),
│                       ProtectedRoute.tsx (auth gate), PermissionRoute.tsx (RBAC gate).
├── Store/                store.ts, rootReducer.ts, hooks.ts — see "Redux store" below.
├── hooks/                Cross-feature hooks: usePermission, useDebounce.
├── services/             axios.ts (configured instance), interceptors.ts
│                       (auth/refresh wiring), uploadApi.ts (image upload).
├── utils/                constants.ts, rolePermissions.ts, helpers.ts, formatters.ts.
├── types/                common.ts, api.ts — types shared across every feature.
├── theme/                MUI theme (palette, typography, component overrides).
└── contexts/            React context providers outside Redux (e.g. theme mode).
```

## Feature layering

Every folder under `src/features/<name>/` follows the same one-way layering,
confirmed by reading `src/features/staff/`:

```
<name>Types.ts → <name>Api.ts → <name>Thunk.ts → <name>Slice.ts → <name>Selectors.ts → components/ → pages/
```

- **`<name>Types.ts`** — the domain shape, plus create/update form-value types. These
  are hand-kept mirrors of the corresponding be-boiler Mongoose model and Zod
  validators (see the comment block at the top of `staffTypes.ts`), not generated —
  a backend field rename requires a manual update here.
- **`<name>Api.ts`** — thin wrappers around `axiosInstance` (from `services/axios.ts`),
  one function per backend endpoint. Returns the raw `ApiResponse<T>` envelope
  (`types/api.ts`); no state, no error handling beyond letting axios throw.
- **`<name>Thunk.ts`** — `createAsyncThunk`s that call the API layer, unwrap
  `response.data`, and convert thrown errors to a string via
  `getApiErrorMessage` (`utils/helpers.ts`) using `rejectWithValue`.
- **`<name>Slice.ts`** — a `createSlice` whose `extraReducers` handle each
  thunk's `pending`/`fulfilled`/`rejected`, tracking `loading`/`submitting`/`error`
  and updating both the list and any selected-item state.
- **`<name>Selectors.ts`** — plain functions of `RootState`, one per piece of
  state the slice exposes. Components never reach into `state.<slice>` directly.
- **`components/`** — feature-local presentational/composed pieces (tables, forms,
  drawers) built from `components/common/*` and bound to the slice via the
  selectors and thunks above.
- **`pages/<Name>/`** — the route-level page, composed from the feature's
  components, gated by permission where applicable (see RBAC below).

Not every feature uses every layer identically (e.g. `maintenanceLogs`'s slice
key in the store is `maintenances`, not `maintenanceLogs` — see `rootReducer.ts`),
but the types → api → thunk → slice → selectors → components → page direction
holds throughout: nothing imports "backwards" (a slice never imports from
`components/`, an API module never imports a thunk).

## Redux store

`src/Store/store.ts` builds the store with `configureStore` and RTK's default
middleware (the serializable/immutable dev checks stay on — no slice currently
needs an exception carved out).

`src/Store/rootReducer.ts` is the single place every feature's reducer is
registered via `combineReducers`. Adding a new feature means adding one import
and one line here; nothing else discovers slices automatically.

`src/Store/hooks.ts` exports `useAppDispatch`/`useAppSelector` — typed wrappers
around `useDispatch`/`useSelector` bound to `AppDispatch`/`RootState`. These are
used everywhere instead of the plain react-redux hooks so thunk dispatches and
selector return types are checked by TypeScript.

## Permission / RBAC system

This is a **UX layer only**. The real enforcement boundary is be-boiler's
`authorizeRoles` middleware (`src/middlewares/rbac.middleware.ts` in the
be-boiler repo), applied per route — the backend authorizes purely by the
user's `role` field and never returns a permissions array. Everything described below exists
to make the UI *look* consistent with what the API will actually allow; it
must never be treated as a security control, since any client-side check can
be bypassed by calling the API directly.

The pieces, end to end:

1. **`utils/rolePermissions.ts`** — hand-maintained map from each `StaffRole`
   (`admin` | `manager` | `cashier`) to an array of permission strings drawn
   from `utils/constants.ts`'s `PERMISSIONS` object. This is the frontend's
   mirror of be-boiler's per-route role guards, and has to be kept in sync by
   hand whenever a backend route's allowed roles change.
2. **`utils/constants.ts`** (`PERMISSIONS`) — the full catalog of permission
   strings (`STAFF_EDIT`, `INVENTORY_ADJUST_STOCK`, etc.), grouped by module.
3. **`features/auth`** (owned by another agent) — on login, resolves the
   logged-in user's role through `getPermissionsForRole` and stores the
   resulting permission list in `state.auth.permissions`.
4. **`hooks/usePermission.ts`** — reads `state.auth.permissions` via
   `selectPermissions` and exposes three hooks: `usePermission(one)`,
   `usePermissions(all)`, `useAnyPermission(any)`.
5. **Route-level gating** — `routes/routeConfig.ts` attaches an optional
   `permission` field to each route entry; `routes/AppRoutes.tsx` wraps the
   route's element in `PermissionRoute` when one is set.
   `routes/PermissionRoute.tsx` calls `usePermission` and renders an
   "Access Denied" screen instead of the page when it's false. This is
   separate from `ProtectedRoute.tsx`, which only checks *authentication*
   (is there a logged-in user at all), not *authorization*.
6. **Component-level gating** — inside an already-permitted page, individual
   actions are conditionally rendered by calling `usePermission` directly,
   e.g. `StaffTable.tsx` and `StaffDetailPage.tsx` compute `canEdit`,
   `canManageStatus`, `canManageRole` and use them to hide/disable specific
   buttons — a user might have `STAFF_VIEW` but not `STAFF_EDIT`, so the page
   renders but individual row actions don't.

## Shared component library (`src/components/common/`)

A flat set of generic, feature-agnostic building blocks — no component here
imports from `features/`:

| Component | Purpose |
|---|---|
| `DataTable` | Virtualized (react-virtuoso), sortable, paginated table with row actions; owns its own loading/empty/error states via `EmptyState`/`ErrorState`. |
| `EmptyState` / `ErrorState` | Standalone placeholder screens for "no data" and "failed to load", the latter with a retry action. |
| `LoadingOverlay` | Full-area or full-screen spinner. |
| `ConfirmDialog` | Generic "are you sure?" modal for destructive actions. |
| `PageHeader` | Page title + breadcrumbs + action buttons row. |
| `StatusChip` | Small color-coded label (active/inactive, in-stock/low-stock, etc.). |
| `FormInput` / `FormSelect` / `DatePicker` | react-hook-form-bound MUI field wrappers (`Controller`-based). |
| `FormikInput` / `FormikSelect` / `FormikDatePicker` / `FormikTimePicker` | Formik-bound equivalents, rendering a static label above the field to match the Add/Edit drawer design rather than MUI's default floating label. |
| `FormGrid` | Shared two-column responsive grid layout used by Add/Edit slide-in panels. |
| `ImageDropzone` | Drag-and-drop / click-to-browse image upload that posts to `/uploads/image` immediately and reports back a URL. |

Two form-binding families exist side by side (`Form*` for react-hook-form,
`Formik*` for Formik) because different features were built with different
form libraries — pick whichever the surrounding feature already uses rather
than mixing both in one form.

## Related docs

- [Authentication flow](./authentication-flow.md)
- [Staff management](./staff-management.md)
- [Inventory management](./inventory-management.md)
