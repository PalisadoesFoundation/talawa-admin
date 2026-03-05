[Admin Docs](/)

***

# Interface: ITableState

Defined in: [src/types/shared-components/DataTable/types.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L41)

Complete state of a table including sorting, filtering, and selection.

Represents the combined state of all table operations for persistence or state management.

## Properties

### filters?

> `optional` **filters**: [`IFilterState`](IFilterState.md)[]

Defined in: [src/types/shared-components/DataTable/types.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L45)

Array of active column filters

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/types.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L47)

Global search query string applied across all searchable columns

***

### selectedRows?

> `optional` **selectedRows**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/types.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L49)

Immutable set of currently selected row keys

***

### sorting?

> `optional` **sorting**: [`ISortState`](ISortState.md)[]

Defined in: [src/types/shared-components/DataTable/types.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/types.ts#L43)

Array of active sort states (primary sort first)
