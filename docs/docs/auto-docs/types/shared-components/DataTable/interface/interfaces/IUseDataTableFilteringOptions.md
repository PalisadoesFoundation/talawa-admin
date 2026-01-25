[Admin Docs](/)

***

# Interface: IUseDataTableFilteringOptions\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:717](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L717)

Options for the useDataTableFiltering hook.

Configures filtering and search behavior for DataTable.

## Type Parameters

### T

`T`

The type of the row data

## Properties

### columnFilters?

> `optional` **columnFilters**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:729](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L729)

Column filter values by column ID

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:721](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L721)

Column definitions

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:719](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L719)

Array of row data

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:725](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L725)

Controlled global search value

***

### initialGlobalSearch?

> `optional` **initialGlobalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:723](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L723)

Initial value for uncontrolled global search

***

### onColumnFiltersChange()?

> `optional` **onColumnFiltersChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:731](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L731)

Callback when column filters change

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onGlobalSearchChange()?

> `optional` **onGlobalSearchChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:727](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L727)

Callback when global search changes (for controlled mode)

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onPageReset()?

> `optional` **onPageReset**: () => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:739](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L739)

Callback to reset page when filters change

#### Returns

`void`

***

### paginationMode?

> `optional` **paginationMode**: `"client"` \| `"server"`

Defined in: [src/types/shared-components/DataTable/interface.ts:737](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L737)

Pagination mode affects page reset behavior

***

### serverFilter?

> `optional` **serverFilter**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:735](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L735)

If true, column filtering is handled server-side

***

### serverSearch?

> `optional` **serverSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:733](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L733)

If true, global search is handled server-side
