[Admin Docs](/)

***

# Interface: IUseDataTableFilteringOptions\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:660](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L660)

Options for the useDataTableFiltering hook.

Configures filtering and search behavior for DataTable.

## Type Parameters

### T

`T`

The type of the row data

## Properties

### columnFilters?

> `optional` **columnFilters**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:672](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L672)

Column filter values by column ID

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:664](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L664)

Column definitions

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:662](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L662)

Array of row data

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:668](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L668)

Controlled global search value

***

### initialGlobalSearch?

> `optional` **initialGlobalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:666](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L666)

Initial value for uncontrolled global search

***

### onColumnFiltersChange()?

> `optional` **onColumnFiltersChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:674](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L674)

Callback when column filters change

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onGlobalSearchChange()?

> `optional` **onGlobalSearchChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:670](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L670)

Callback when global search changes (for controlled mode)

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onPageReset()?

> `optional` **onPageReset**: () => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:682](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L682)

Callback to reset page when filters change

#### Returns

`void`

***

### paginationMode?

> `optional` **paginationMode**: `"client"` \| `"server"`

Defined in: [src/types/shared-components/DataTable/interface.ts:680](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L680)

Pagination mode affects page reset behavior

***

### serverFilter?

> `optional` **serverFilter**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:678](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L678)

If true, column filtering is handled server-side

***

### serverSearch?

> `optional` **serverSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:676](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L676)

If true, global search is handled server-side
