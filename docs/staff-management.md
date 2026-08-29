# Staff Management

Covers the Staff feature and the Attendance feature together, because the UI bundles them the same way the backend does: Attendance is a tab inside the Staff page, not a separate page or nav entry.

## The data flow pattern

Every feature in this app (not just Staff) follows the same one-way layering:

```
staffTypes.ts  →  staffApi.ts  →  staffThunk.ts  →  staffSlice.ts  →  staffSelectors.ts  →  components/*  →  pages/*
```

- **`staffTypes.ts`** — TypeScript interfaces mirrored 1:1 from be-boiler's `User` model and `staff.validator.ts` schemas. Comments call out where the two diverge (e.g. `age` is a virtual, present only when `dateOfBirth` is set; `seed:admin`-created accounts can lack `phone`/`salary`/etc. even though `createStaffSchema` requires them for anyone created via the UI).
- **`staffApi.ts`** — thin axios wrappers, one function per backend endpoint. No business logic; the file's own comments explain the few backend quirks that shape it (PATCH not PUT, dedicated activate/deactivate/role endpoints instead of a generic update).
- **`staffThunk.ts`** — `createAsyncThunk` wrappers that call the API functions and normalize errors via `getApiErrorMessage`, so slices never see raw axios errors.
- **`staffSlice.ts`** — owns `StaffState` (list, selected staff, loading/submitting flags, pagination, error). Adapts the backend's `{page, limit, total, totalPages}` pagination shape into the `PaginationMeta` shape the shared `DataTable` component expects.
- **`staffSelectors.ts`** — plain `(state: RootState) => ...` accessors; components never reach into `state.staff` directly.
- **`components/`** — presentational + connected pieces (`StaffTable`, `StaffNameCell`, `StaffFormDrawer`).
- **`pages/Staff/`** — `StaffListPage` (list + tabs + filters) and `StaffDetailPage` (single staff profile) compose the above into full screens.

Attendance is a separate feature folder (`src/features/attendance/`) with the identical shape (`attendanceTypes.ts` → `attendanceApi.ts` → `attendanceThunk.ts` → `attendanceSlice.ts` → `attendanceSelectors.ts` → `components/`), but it has no page of its own — its components are rendered from inside `StaffListPage`.

## Staff CRUD

| UI action | Component | Thunk | Endpoint |
|---|---|---|---|
| List / search / filter / sort | `StaffListPage` → `StaffTable` | `fetchStaffList` | `GET /staff` |
| View one | `StaffDetailPage` | `fetchStaffById` | `GET /staff/:id` |
| Create | `StaffFormDrawer` (mode `create`) | `createStaffThunk` | `POST /staff` |
| Edit | `StaffFormDrawer` (mode `edit`) | `updateStaffThunk` | `PATCH /staff/:id` |
| Deactivate / reactivate | `StaffTable` row action, `StaffDetailPage` button | `toggleStaffActiveThunk` | `PATCH /staff/:id/deactivate` or `/activate` |
| Change role | `StaffDetailPage` inline role editor | `assignStaffRoleThunk` | `PATCH /staff/:id/role` |

**One drawer, two modes.** `StaffFormDrawer` (`src/features/staff/components/StaffFormDrawer.tsx`) handles both create and edit, switching its yup schema and which fields render based on `mode`. Password and role fields only render in `create` mode — be-boiler's `updateStaffSchema` is `.strict()` and rejects both keys outright, so an edit submission is a trimmed `StaffUpdateFormValues` payload, and role changes go through the dedicated "Change Role" control on the detail page instead.

**Soft delete only.** There is no delete button anywhere in the Staff UI — "Deactivate" (`PATCH /staff/:id/deactivate`) is the closest equivalent, and it flips `isActive` rather than removing the record. `activateStaff`/`deactivateStaff` are exposed as separate `staffApi.ts` functions but collapsed into one `toggleStaffActiveThunk` that picks the right call based on the staff member's current `isActive` value. Note the permission gating this control uses is confusingly named: `PERMISSIONS.STAFF_DELETE` (checked in both `StaffTable.tsx` and `StaffDetailPage.tsx`) governs activate/deactivate, not a real delete — there is no hard-delete endpoint for staff to gate.

**Search/filter is server-side.** `StaffListPage` debounces the search box (400ms, via `useDebounce`) and sends `search`, `role`, and `includeInactive` straight through as query params on `GET /staff` — none of it is filtered client-side. Changing any of search/role/includeInactive/sort resets pagination to page 1, since the previously-selected page may no longer exist in the new filtered result set.

**Sort options are a curated list**, not a raw column-header toggle — `SORT_OPTIONS` in `StaffListPage.tsx` exposes 4 canned combinations (Name A-Z, Salary high-to-low, Date of Birth, Newest first) via a "Sort by" dropdown, but `StaffTable`'s sortable column headers also work and set a "Custom" sort.

## RBAC gating

Every write action checks `usePermission(PERMISSIONS.X)` before rendering its trigger (button/menu item) — `STAFF_CREATE` gates "Add Staff", `STAFF_EDIT` gates the edit action, `STAFF_DELETE` gates activate/deactivate, `STAFF_MANAGE_ROLE` gates the role editor. This is UI-only gating: the actual protection is server-side (`authorizeRoles(...)` on the backend), so this is about hiding controls a user isn't allowed to use, not enforcing the rule. See [RBAC & Routing](./architecture.md) for how `usePermission` and the permission list itself are wired up — that's a separate cross-cutting concern this doc doesn't duplicate.

One gap worth knowing about: be-boiler blocks an admin from deactivating or role-changing their *own* account (self-action guard, enforced server-side). The frontend does not hide or disable these controls when a user is looking at their own profile — clicking them still round-trips to the backend, which rejects with a 403. There's no client-side "is this me" check anywhere in `StaffDetailPage.tsx`.

## Attendance

Attendance lives entirely inside `StaffListPage`, behind a "Staff Management" / "Attendance" tab switch (`activeTab` state). Switching to the Attendance tab reuses the exact same `list` of staff already loaded for the Staff tab — there's no separate "attendance list" endpoint, since be-boiler nests attendance under staff (`/staff/:id/attendance*`) rather than exposing it as a top-level resource.

- A date picker (MUI `DatePicker`, defaulting to today) selects which day's attendance is being viewed/marked.
- `AttendanceTable` (`src/features/attendance/components/AttendanceTable.tsx`) renders the same staff rows with a Date/Status column swapped in for Email/Phone/Salary.
- `AttendanceStatusCell` (one per row) is the actual marking UI: it fetches that staff member's attendance for the selected date on mount (`fetchAttendanceForDate`), then renders either four pastel status buttons (Present/Absent/Half Shift/Leave) if unmarked, or a single solid pill showing the current status with an edit pencil if already marked. Clicking any status button dispatches `markAttendanceThunk`, which hits `PUT /staff/:id/attendance/:date` — the same upsert endpoint marks an unrecorded day or edits an already-recorded one.
- Redux state for attendance is keyed by `` `${staffId}::${date}` `` (`attendanceKey`, `attendanceTypes.ts`) rather than nested under staff or date alone, since the UI needs to independently track one entry per (staff, date) pair shown on screen.
- Marking is gated by `PERMISSIONS.ATTENDANCE_MARK` — without it, the status buttons/pill still render (so the current status is visible) but are `disabled`.

## Related docs

- [RBAC & Routing](./architecture.md) — how `usePermission`/the permission list are implemented
- [Inventory Management](./inventory-management.md) — the sibling feature, same layering pattern
