# Senior React ERP Boilerplate — Walkthrough

## Overview

The ERP Boilerplate has been successfully implemented according to your architectural requirements. It is a true enterprise-grade architecture leveraging feature-based design, strict Redux encapsulation, and advanced centralized HTTP handling. 

> [!TIP]
> **Production Ready**
> This boilerplate is ready to scale. It avoids global anti-patterns and ensures every business domain (like `aircraft`, `auth`) is strictly isolated, making it safe for large teams to work concurrently.

## Core Architectural Pillars

### 1. Feature-Based Architecture
We adopted a strict feature-module pattern. Each business domain (e.g., `auth`, `aircraft`) lives entirely within `src/features/[module]/`.
- **Self-Contained**: Each feature owns its own `[module]Slice.ts`, `[module]Thunk.ts`, `[module]Selectors.ts`, and `[module]Types.ts`.
- **UI Components**: Business-specific components (like `AircraftTable`, `AircraftFilters`) live inside the feature module, keeping `src/components/common/` strictly for generic, reusable UI (like `DataTable`, `FormInput`).

### 2. State Management (Redux Toolkit)
The application avoids generic "global state" entirely.
- **Typed Hooks**: `useAppDispatch` and `useAppSelector` are enforced across the app to ensure 100% type safety.
- **Selectors**: Memoized selectors extract state for the UI, ensuring components never parse raw Redux state themselves.
- **Thunks for Side Effects**: All asynchronous business logic is handled in `createAsyncThunk`. UI components (Pages) only dispatch thunks and read loading/error states.

### 3. Centralized HTTP & Axios Queueing
The Axios instance (`src/services/axios.ts`) manages all API communication.
> [!IMPORTANT]
> **Refresh Token Queueing**
> The interceptor implements a `failedQueue` array. If multiple API requests fail with 401 Unauthorized simultaneously, only *one* refresh token request is fired. All other requests wait in the queue and retry automatically once the new token arrives.

### 4. Advanced Form Validation
Forms are powered by **React Hook Form** + **Yup** schemas.
- We created generic wrapper components (`FormInput`, `FormSelect`, `DatePicker`) that internally use `<Controller />`.
- This ensures minimal re-renders. The UI strictly follows the separation of presentation and validation.

### 5. Routing & Permissions
- **Lazy Loading**: All pages are lazy-loaded in `src/routes/routeConfig.ts`.
- **Protected Routes**: Routes are guarded by `<ProtectedRoute />` which ensures the user is authenticated.
- **Role-Based Access Control (RBAC)**: We implemented a `usePermission` hook and a `<PermissionRoute />` wrapper. Pages and Sidebar links dynamically hide based on the user's permissions array (e.g., `AIRCRAFT_VIEW`, `AIRCRAFT_EDIT`).

## UI & Design Aesthetics

The UI is built to impress, using a premium dark enterprise theme.

* **Color Palette**: Deep, modern dark mode (`#0a0e1a` background) with vibrant indigo/purple gradients for primary accents.
* **Typography**: Uses `Inter` with modern weights and tight letter spacing for an "Apple-like" enterprise feel.
* **Glassmorphism**: Login pages and floating elements use subtle backdrop blurs and semi-transparent backgrounds.
* **Micro-interactions**: Hover effects, smooth transitions on sidebars, and custom stylized scrollbars.

## Implemented Modules

1. **Authentication**: Fully functional login, token storage, and user state initialization.
2. **Dashboard**: High-level statistical cards and quick actions.
3. **Aircraft (Reference Implementation)**:
   - Full CRUD pages: List, Create, Edit, Detail.
   - Filterable, sortable `DataTable`.
   - Advanced Yup validation handling complex types (dates, numbers, enums).
4. **Stubs**: Users, Purchase Orders, Maintenance modules are scaffolded following the exact same pattern, ready for business logic.

> [!NOTE]
> **Next Steps**
> You can now boot up the application (`npm run dev`), define the actual backend API endpoints in the environment variables, and begin fleshing out the remaining feature modules (Users, Roles, Orders) using the `Aircraft` module as your definitive reference guide.
