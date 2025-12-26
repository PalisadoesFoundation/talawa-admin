[Admin Docs](/)

***

# Interface: IDataTableProps\<T, TValue\>

Defined in: [src/shared-components/DataTable/types.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L55)

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: [src/shared-components/DataTable/types.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L57)

***

### data

> **data**: `T`[]

Defined in: [src/shared-components/DataTable/types.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L56)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/shared-components/DataTable/types.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L60)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/shared-components/DataTable/types.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L61)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/shared-components/DataTable/types.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L58)

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/shared-components/DataTable/types.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L62)

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: [src/shared-components/DataTable/types.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/types.ts#L59)
