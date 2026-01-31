[Admin Docs](/)

***

# Function: PaginationControls()

> **PaginationControls**(`page`): `Element`

Defined in: [src/shared-components/DataTable/Pagination.tsx:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/Pagination.tsx#L24)

PaginationControls component for navigating through paginated data.

Type Safety: IPaginationControlsProps enforces number types for pageSize and totalItems.
TypeScript prevents string/unknown types at compile-time, so runtime Number.isFinite()
checks are defensive fallbacks only (should never receive strings from properly-typed callers).

AUDIT RESULT: All call sites verified (DataTable.tsx only caller):
- pageSize: defaults to 10 (numeric), derived from props with number type
- totalItems: comes from (totalItems ?? data.length), both numeric
- No URL/form-based string-to-number coercion needed (type safety enforced)

## Parameters

### page

[`InterfacePaginationControlsProps`](../../../../types/shared-components/DataTable/pagination/interfaces/InterfacePaginationControlsProps.md)

Current page number (1-indexed)

## Returns

`Element`

Pagination navigation controls
