[Admin Docs](/)

***

# Interface: InterfaceLoadingMoreRowsProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:312](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L312)

Props for the LoadingMoreRows component.

Manages UI state when loading additional pages in infinite-scroll scenarios,
including error recovery with retry capability.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L314)

Array of column definitions to match row structure

***

### columnsCount?

> `optional` **columnsCount**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:322](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L322)

Number of columns in the table (for colspan)

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L316)

Whether to show selection checkbox column

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/props.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L326)

Error from the most recent load attempt

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L318)

Whether to show actions column

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L324)

Whether more rows are currently loading

***

### retry()?

> `optional` **retry**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L328)

Callback to retry loading after an error

#### Returns

`void`

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L320)

Number of skeleton rows to display
