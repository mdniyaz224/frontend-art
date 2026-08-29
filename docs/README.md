# Documentation

Concept-by-concept reference for the `fe-boilerplate` frontend. Each doc covers one part of the system: what it does, why it's built that way, and where the code lives. Mirrors the structure of `be-boiler`'s own `docs/`.

| Doc | Covers |
|---|---|
| [architecture.md](./architecture.md) | Folder structure, the `types → api → thunk → slice → selectors → components → page` feature layering, Redux store setup, the client-side RBAC/permission system, shared component library |
| [authentication-flow.md](./authentication-flow.md) | Login, token storage, the axios interceptor's refresh/retry flow, logout, route auth-gating |
| [staff-management.md](./staff-management.md) | Staff CRUD, role assignment, search/filter, deactivate, and the Attendance tab |
| [inventory-management.md](./inventory-management.md) | Product CRUD, the Adjust Stock flow, the stock-adjustment audit trail viewer, low-stock indicators, search/filter |
| [user-and-maintenance.md](./user-and-maintenance.md) | The Users feature and the MaintenanceLogs feature (the latter is a frontend-only stub with no backend counterpart yet) |

For backend API context (endpoints, request/response shapes, RBAC enforcement), see `be-boiler`'s own [docs/](../../be-boiler/docs/README.md).
