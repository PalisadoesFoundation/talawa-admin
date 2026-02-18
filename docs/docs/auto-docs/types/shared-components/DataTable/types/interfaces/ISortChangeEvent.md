[Admin Docs](/)

***

# Interface: ISortChangeEvent\<T\>

Defined in: [src/types/shared-components/DataTable/types.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L60)

Event object passed to onSortChange callback when sort state changes.

Provides complete information about the sort change including the new sort state array,
the primary sort direction, and the column definition that triggered the change.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### column

> **column**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/types.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L66)

Column definition that triggered the sort change

***

### sortBy

> **sortBy**: [`ISortState`](ISortState.md)[]

Defined in: [src/types/shared-components/DataTable/types.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L62)

Array of sort states (primary sort first, can include multiple columns)

***

### sortDirection

> **sortDirection**: [`SortDirection`](../type-aliases/SortDirection.md)

Defined in: [src/types/shared-components/DataTable/types.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L64)

Direction of the primary sort
