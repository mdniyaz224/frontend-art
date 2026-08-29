# Users and MaintenanceLogs

Two features that look symmetric with the rest of the app (a `features/*` slice, a route, a
permission) but are, in practice, in very different states. This doc documents what each
actually does today, not what its name implies it should do.

## Users

**What exists:** a fully-built Redux slice (`src/features/users/userSlice.ts`), thunks
(`userThunk.ts`), an API layer (`userApi.ts`), and types (`userTypes.ts`) — all wired into the
store as `state.users` (`src/Store/rootReducer.ts`). **What's missing:** `UsersPage`
(`src/pages/Users/UsersPage.tsx`) doesn't use any of it. It renders a static `EmptyState` card and
says so explicitly: *"This module follows the Staff reference implementation. Add user management
logic following the same feature-based pattern."* This is the intended next-feature scaffold, not
a bug.

### The API layer only half matches the backend

`userApi.ts` calls five endpoints; only one of them exists on be-boiler today:

| Function | Endpoint | Exists on be-boiler? |
|---|---|---|
| `getUserList` | `GET /users` | Yes — admin-only, see `user.routes.ts` |
| `getUserById` | `GET /users/:id` | No |
| `createUser` | `POST /users` | No |
| `updateUser` | `PUT /users/:id` | No |
| `deleteUser` | `DELETE /users/:id` | No |

be-boiler's `user.routes.ts` only defines `GET /users/me` and `GET /users` (admin-only, paginated
list). There is no user create/update/delete route — account lifecycle management lives entirely
under `/staff` instead (`POST /staff`, `PATCH /staff/:id`, `PATCH /staff/:id/deactivate`, etc. —
see be-boiler's `staff-management.md`). If `UsersPage` is ever built out past the stub, either
those four functions need backend routes that don't currently exist, or — more likely, given the
"follow the Staff reference implementation" note left in the stub — the Users feature is meant to
be re-pointed at `/staff` endpoints rather than `/users` ones.

### The type shape doesn't match the backend either

`UserRecord` (`userTypes.ts`) models a user as `firstName`/`lastName` + a `role: { id, name }`
object + a `permissions: Permission[]` array + a `status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'`
enum. be-boiler's actual `User` model (mirrored correctly by `src/features/auth/authTypes.ts`'s
`User` interface, which the login/session-restore flow uses) has a single `name` string, a bare
`role` string (`admin`/`manager`/`cashier`), no `permissions` array (permissions are derived
client-side, see [authentication-flow.md](./authentication-flow.md)), and `isActive: boolean`
rather than a three-state status enum. `UserRecord` reads like it was scaffolded from a generic
ERP boilerplate before be-boiler's actual shape was known, and never reconciled.

### Who can reach it

`/users` is permission-gated behind `PERMISSIONS.USER_VIEW` (`routeConfig.ts`). Checking the
role → permission map (`src/utils/rolePermissions.ts`) that drives this gate: **no role — admin,
manager, or cashier — is currently granted `USER_VIEW`.** The route exists and is wired into
`AppRoutes`, but every logged-in user who navigates to `/users` today hits `PermissionRoute`'s
"Access Denied" screen, regardless of role. This is worth knowing before assuming the stub is
merely cosmetic — the page is currently unreachable in the running app.

## MaintenanceLogs

This is a frontend-only feature with no backend counterpart at all. be-boiler has no maintenance
concept anywhere — no route, controller, service, or model matches it (verified by searching the
backend source for "maintenance").

**What exists:** `maintenanceLogsSlice.ts` (state: `logs: MaintenanceLog[]`, `loading: boolean`,
one reducer `setLogs`) and `maintenanceLogTypes.ts` (a `MaintenanceLog` shape:
`id`/`assetId`/`description`/`status: 'open' | 'closed'`/`createdAt`), registered in the store as
`state.maintenances`. **What's missing:** there is no `maintenanceLogsApi.ts` and no
`maintenanceLogsThunk.ts` — nothing in the codebase ever dispatches `setLogs`. The slice is inert:
it holds an empty array forever unless something is added to populate it.

`MaintenancePage` (`src/pages/Maintenance/MaintenancePage.tsx`) mirrors `UsersPage` exactly — a
static `EmptyState` card with the same "follow the Staff reference implementation" note — and,
like `userSlice`, doesn't reference `maintenanceLogsSlice` at all.

`/maintenance` is gated behind `PERMISSIONS.MAINTENANCE_VIEW`, which — same as `USER_VIEW` above —
no role is currently granted in `src/utils/rolePermissions.ts`. So this route, too, is reachable
in the route table but resolves to "Access Denied" for every user today.

### If this feature is built out

Since be-boiler has nothing to talk to, building this out for real means either:

- adding a `maintenance` domain to be-boiler (route/controller/service/model, following the
  layering in [architecture.md](./architecture.md)) and then writing `maintenanceLogsApi.ts` +
  `maintenanceLogsThunk.ts` to match, the same way `authApi.ts`/`userApi.ts` mirror `auth`/`user`
  routes today; or
- treating it as intentionally local-only (e.g. a client-side checklist with no server
  persistence), in which case the current `setLogs`-only reducer is close to sufficient and just
  needs a page that actually dispatches it.

Either way, nothing here should be mistaken for a working feature — the honest current state is
"typed placeholder, not connected to anything."

## Where each piece lives

| Concern | File |
|---|---|
| Users Redux state/reducers | `src/features/users/userSlice.ts` |
| Users thunks (list + get-by-id only) | `src/features/users/userThunk.ts` |
| Users HTTP calls (partially unmatched by the backend — see above) | `src/features/users/userApi.ts` |
| Users types (shape mismatch — see above) | `src/features/users/userTypes.ts` |
| Users page (stub) | `src/pages/Users/UsersPage.tsx` |
| MaintenanceLogs Redux state/reducer (`setLogs`, never dispatched) | `src/features/maintenanceLogs/maintenanceLogsSlice.ts` |
| MaintenanceLogs types | `src/features/maintenanceLogs/maintenanceLogTypes.ts` |
| Maintenance page (stub) | `src/pages/Maintenance/MaintenancePage.tsx` |
| Route + permission wiring for both | `src/routes/routeConfig.ts` |
| Role → permission map (neither `USER_VIEW` nor `MAINTENANCE_VIEW` is granted to any role) | `src/utils/rolePermissions.ts` |

## Related docs

- [authentication-flow.md](./authentication-flow.md) — login/session/permission-derivation, referenced above for how `permissions` ends up on the auth user.
- [architecture.md](./architecture.md) — the route/permission-gating system (`ProtectedRoute` + `PermissionRoute`) that determines reachability for both features above.
