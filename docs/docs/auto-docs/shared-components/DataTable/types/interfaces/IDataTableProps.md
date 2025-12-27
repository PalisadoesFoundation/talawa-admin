[Admin Docs](/)

***

# Interface: IDataTableProps\<T, TValue\>

Defined in: src/shared-components/DataTable/types.ts:53

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: src/shared-components/DataTable/types.ts:55

***

### data

> **data**: `T`[]

Defined in: src/shared-components/DataTable/types.ts:54

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: src/shared-components/DataTable/types.ts:58

***

### error?

> `optional` **error**: `Error`

Defined in: src/shared-components/DataTable/types.ts:59

***

### loading?

> `optional` **loading**: `boolean`

Defined in: src/shared-components/DataTable/types.ts:56

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: src/shared-components/DataTable/types.ts:60

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: src/shared-components/DataTable/types.ts:57
