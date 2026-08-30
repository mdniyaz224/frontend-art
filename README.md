# COSYPOS — Frontend

A React + TypeScript frontend for a restaurant back-office ERP: staff management with attendance tracking, inventory with auditable stock adjustments, and dashboard analytics, sitting behind JWT authentication.

## Tech Stack

| Layer | Choice |
|---|---|
| UI framework | React 19 + TypeScript, built with Vite 6 |
| Component library | MUI 6 (+ Emotion) |
| State management | Redux Toolkit + React Redux |
| Routing | React Router 7 |
| Forms & validation | Formik + Yup |
| HTTP | Axios, single shared instance with interceptors |
| Charts | Recharts |
| Unit testing | Vitest + React Testing Library |
| E2E testing | Playwright |

## Modules

The product surface is four modules:

1. **Auth** — login, logout, session restore from a stored access token, silent token refresh.
2. **Dashboard** — sales/revenue/table-occupancy analytics (backed by `features/sales`).
3. **Staff** — staff CRUD and role assignment, with **Attendance** nested under it (per-staff attendance marking and history, no standalone route).
4. **Inventory** — product CRUD, categories, and stock adjustments with a full audit trail.

## Architecture

### Feature-based structure

```
src/
├── features/               business domains: auth, staff, attendance, inventory, sales
│   └── <feature>/
│       ├── <feature>Api.ts        HTTP calls only — no business logic
│       ├── <feature>Thunk.ts      async orchestration, built on createApiThunk
│       ├── <feature>Slice.ts      Redux state for this domain
│       ├── <feature>Selectors.ts  memoized reads — components never touch raw state
│       ├── <feature>Types.ts      domain types + shared option lists (e.g. STAFF_ROLE_OPTIONS)
│       └── components/            feature-specific UI (forms, tables, dialogs)
├── pages/                   one route-level screen per module
├── components/
│   ├── common/              generic reusable UI — DataTable, ConfirmDialog, ImageDropzone, ...
│   └── layout/              app shell — Sidebar, Header, MainLayout
├── services/                axios instance, interceptors, centralized API endpoint map
├── Store/                   Redux store + typed hooks
├── routes/                  route config, lazy page registry, auth/permission guards
├── hooks/                   shared hooks (useDebounce, usePermission)
├── utils/                   constants, formatters, helpers, the createApiThunk factory
└── types/                   cross-cutting types — ApiResponse, PaginationMeta, ...
```

### API layer

- Every HTTP call goes through one shared `axiosInstance` (`services/axios.ts`).
- Every backend route is declared exactly once in `services/apiEndpoints.ts` (`API_ENDPOINTS`); feature `*Api.ts` files import from it rather than hardcoding path strings, so a backend route rename touches one file.
- `services/interceptors.ts` attaches the bearer token to outgoing requests and implements refresh-token queueing: if several requests get a 401 at once, only one refresh call fires and the rest wait on it and retry. Login/logout/refresh itself are excluded from triggering a refresh — a 401 there means bad credentials or no session, not an expired token.
- Every thunk that calls the API is built with `utils/createApiThunk.ts`, which centralizes the `try/catch → rejectWithValue(getApiErrorMessage(error))` pattern so feature thunks only describe the call itself.

### Access control

- Permissions are plain string constants (`utils/constants.ts` → `PERMISSIONS`).
- `utils/rolePermissions.ts` maps each `StaffRole` (`admin` / `manager` / `cashier`) to the permissions it holds.
- The `usePermission` hook and `<PermissionRoute>` guard pages; the Sidebar filters its own nav items against the same permission list, so a role that can't reach a page never sees a link to it either.

### Code splitting

- Every page is behind `React.lazy` (`routes/routeConfig.ts` + `routes/AppRoutes.tsx`), including the login screen.
- Secondary, conditionally-opened UI is split independently of its page — e.g. `StockAdjustmentHistoryDialog` only loads when a user actually opens the stock-history view, not when the Inventory page mounts.
- Vendor code is chunked by library in `vite.config.ts` (`react-vendor`, `mui-vendor`, `charts-vendor`, `redux-vendor`, `forms-vendor`) so a deploy that only changes app code doesn't force users to re-download unchanged third-party code.

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the backend API this frontend talks to

### Install

```bash
npm ci
```

### Environment variables

Vite picks up `.env.development` for `npm run dev` and `.env.production` for `npm run build` automatically.

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL the axios instance targets, e.g. `http://localhost:5000/api/v1` |
| `VITE_APP_NAME` | Display name shown in the UI |
| `VITE_APP_VERSION` | Version string shown in the UI |

### Run

```bash
npm run dev       # dev server on http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc`) then produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run the Vitest unit-test suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Run Playwright tests in UI mode |

## Testing

- **Unit tests** (Vitest + Testing Library) sit next to the slice they cover — e.g. `features/staff/staffSlice.test.ts`.
- **E2E tests** (Playwright, `e2e/`) run against mocked API routes: `login.spec.ts` covers the auth flow, `module-smoke.spec.ts` smoke-tests that Dashboard, Staff, and Inventory each load correctly after login.

## CI/CD

`.github/workflows/main.yml` runs on every push and pull request to `main`:

1. **Build & Lint** — `npm ci`, `npm run lint`, `npm test`, `npm run build`.
2. **E2E** — Playwright against a fresh headless Chromium install.
3. On a push to `main` only, two independent deploy paths run:
   - **Docker image → GitHub Container Registry**, via the repo's multi-stage `Dockerfile` (Node build stage → Nginx runtime stage), for anyone self-hosting the container.
   - **Static deploy → S3 + CloudFront**, authenticating to AWS via OIDC (no long-lived AWS keys stored in GitHub), syncing `dist/` to S3 and invalidating the CloudFront cache.

## Conventions

- No comments except where they capture a non-obvious constraint the code can't express on its own (a backend contract quirk, a library gotcha, the reason behind an otherwise-surprising choice). Never comment what the code already says.
- One source of truth per concept: API paths live only in `API_ENDPOINTS`, option lists like `STAFF_ROLE_OPTIONS` are defined once and reused everywhere they're needed (including validation schemas), shared shapes like `PaginationMeta` are imported, not redeclared.
- Every page, and every heavy conditionally-rendered piece of UI, is loaded via `React.lazy`.
