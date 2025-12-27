[**talawa-admin**](README.md)

***

# Interface: IDataTableProps\<T, TValue\>

Defined in: [src/shared-components/DataTable/types.ts:53](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L53)

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### columns

> **columns**: [`IColumnDef`](shared-components\DataTable\types\README\interfaces\IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: [src/shared-components/DataTable/types.ts:55](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L55)

***

### data

> **data**: `T`[]

Defined in: [src/shared-components/DataTable/types.ts:54](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L54)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/shared-components/DataTable/types.ts:58](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L58)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/shared-components/DataTable/types.ts:59](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L59)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/shared-components/DataTable/types.ts:56](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L56)

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/shared-components/DataTable/types.ts:60](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L60)

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: [src/shared-components/DataTable/types.ts:57](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/DataTable/types.ts#L57)
