[Admin Docs](/)

***

# Interface: InterfaceLoadingMoreRowsProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:296](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L296)

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

Defined in: [src/types/shared-components/DataTable/props.ts:298](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L298)

Array of column definitions to match row structure

***

### columnsCount?

> `optional` **columnsCount**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:306](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L306)

Number of columns in the table (for colspan)

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:300](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L300)

Whether to show selection checkbox column

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/props.ts:310](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L310)

Error from the most recent load attempt

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:302](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L302)

Whether to show actions column

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:308](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L308)

Whether more rows are currently loading

***

### retry()?

> `optional` **retry**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:312](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L312)

Callback to retry loading after an error

#### Returns

`void`

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:304](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L304)

Number of skeleton rows to display
