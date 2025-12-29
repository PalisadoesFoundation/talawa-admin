[Admin Docs](/)

***

# Interface: IDataTableProps\<T, TValue\>

Defined in: [src/shared-components/DataTable/types.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L53)

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/shared-components/DataTable/types.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L69)

Optional accessible label for the table, used for both the visually hidden <caption> and as aria-label on the table element.
This improves accessibility for screen readers and navigation.

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: [src/shared-components/DataTable/types.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L55)

***

### data

> **data**: `T`[]

Defined in: [src/shared-components/DataTable/types.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L54)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/shared-components/DataTable/types.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L62)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/shared-components/DataTable/types.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L63)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/shared-components/DataTable/types.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L56)

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/shared-components/DataTable/types.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L64)

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: [src/shared-components/DataTable/types.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L61)

rowKey: A property name (keyof T) or a function to uniquely identify each row.
If a property name is provided, its value will be coerced to string or number.

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/shared-components/DataTable/types.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L71)

Number of skeleton rows to show when loading (default: 6)
