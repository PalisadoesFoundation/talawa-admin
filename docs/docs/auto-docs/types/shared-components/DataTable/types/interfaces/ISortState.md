[Admin Docs](/)

***

# Interface: ISortState

Defined in: [src/types/shared-components/DataTable/types.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L17)

Represents the current sort state of a table column.

Tracks which column is sorted and in which direction (ascending or descending).

## Properties

### columnId

> **columnId**: `string`

Defined in: [src/types/shared-components/DataTable/types.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L19)

ID of the column being sorted

***

### direction

> **direction**: [`SortDirection`](../type-aliases/SortDirection.md)

Defined in: [src/types/shared-components/DataTable/types.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L21)

Sort direction: 'asc' for ascending or 'desc' for descending
