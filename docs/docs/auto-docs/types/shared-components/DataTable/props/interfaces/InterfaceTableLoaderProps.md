[Admin Docs](/)

***

# Interface: InterfaceTableLoaderProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L41)

Props for table loading states and error/empty conditions.

Provides UI customization and state management for loading indicators,
error messages, and empty state displays.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L49)

ARIA label for the loading state

***

### asOverlay?

> `optional` **asOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L47)

Whether to render as an overlay

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L43)

Array of column definitions to match table structure

***

### emptyComponent?

> `optional` **emptyComponent**: `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L59)

Custom React component to display when no rows are present

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/props.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L55)

Error from the last data fetch operation

***

### errorComponent?

> `optional` **errorComponent**: `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L57)

Custom React component to display when an error occurs

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L51)

Whether the table is loading initial data

***

### loadingMore?

> `optional` **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L53)

Whether additional data is currently loading

***

### rows?

> `optional` **rows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L45)

Number of skeleton rows to display
