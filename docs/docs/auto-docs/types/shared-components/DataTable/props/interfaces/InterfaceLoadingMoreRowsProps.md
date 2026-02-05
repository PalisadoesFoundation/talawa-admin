[Admin Docs](/)

***

# Interface: InterfaceLoadingMoreRowsProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:289](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L289)

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

Defined in: [src/types/shared-components/DataTable/props.ts:291](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L291)

Array of column definitions to match row structure

***

### columnsCount?

> `optional` **columnsCount**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:299](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L299)

Number of columns in the table (for colspan)

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:293](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L293)

Whether to show selection checkbox column

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/props.ts:303](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L303)

Error from the most recent load attempt

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:295](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L295)

Whether to show actions column

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:301](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L301)

Whether more rows are currently loading

***

### retry()?

> `optional` **retry**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:305](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L305)

Callback to retry loading after an error

#### Returns

`void`

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:297](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L297)

Number of skeleton rows to display
