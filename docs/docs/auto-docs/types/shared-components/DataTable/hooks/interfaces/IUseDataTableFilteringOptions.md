[Admin Docs](/)

***

# Interface: IUseDataTableFilteringOptions\<T\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L97)

Configuration options for table data filtering and search functionality.

Provides comprehensive filtering capabilities including global search across all rows,
per-column filtering, and control over client-side vs server-side filtering behavior.
Supports pagination mode detection to manage page reset behavior during filtering.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### columnFilters?

> `optional` **columnFilters**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L109)

Record of column-specific filter values, keyed by column ID

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/hooks.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L101)

Column definitions that determine which columns are searchable or filterable

***

### data?

> `optional` **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/hooks.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L99)

Array of row data to filter and search

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L105)

Current global search query string to match against row data

***

### initialGlobalSearch?

> `optional` **initialGlobalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L103)

Initial value for global search query, used on mount

***

### onColumnFiltersChange()?

> `optional` **onColumnFiltersChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/hooks.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L111)

Callback fired when column filters change, receives updated filter record

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onGlobalSearchChange()?

> `optional` **onGlobalSearchChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/hooks.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L107)

Callback fired when global search query changes, receives new query string

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onPageReset()?

> `optional` **onPageReset**: () => `void`

Defined in: [src/types/shared-components/DataTable/hooks.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L119)

Callback to reset pagination to first page when filters change

#### Returns

`void`

***

### paginationMode?

> `optional` **paginationMode**: `"client"` \| `"server"` \| `"none"`

Defined in: [src/types/shared-components/DataTable/hooks.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L117)

Current pagination mode: 'client' for local paging, 'server' for remote paging, 'none' for no pagination

***

### serverFilter?

> `optional` **serverFilter**: `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L115)

Whether column filtering is handled server-side instead of client-side

***

### serverSearch?

> `optional` **serverSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L113)

Whether search functionality is handled server-side instead of client-side
