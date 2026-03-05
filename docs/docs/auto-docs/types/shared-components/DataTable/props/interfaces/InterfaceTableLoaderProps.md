[Admin Docs](/)

***

# Interface: InterfaceTableLoaderProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L42)

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

Defined in: [src/types/shared-components/DataTable/props.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L50)

ARIA label for the loading state

***

### asOverlay?

> `optional` **asOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L48)

Whether to render as an overlay

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L44)

Array of column definitions to match table structure

***

### emptyComponent?

> `optional` **emptyComponent**: `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L60)

Custom React component to display when no rows are present

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/props.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L56)

Error from the last data fetch operation

***

### errorComponent?

> `optional` **errorComponent**: `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L58)

Custom React component to display when an error occurs

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L52)

Whether the table is loading initial data

***

### loadingMore?

> `optional` **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L54)

Whether additional data is currently loading

***

### rows?

> `optional` **rows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L46)

Number of skeleton rows to display
