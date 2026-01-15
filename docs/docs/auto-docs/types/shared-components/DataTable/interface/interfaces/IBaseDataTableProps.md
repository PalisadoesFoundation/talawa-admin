[**talawa-admin**](../../../../../README.md)

***

# Interface: IBaseDataTableProps\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/interface.ts:310](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L310)

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:334](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L334)

Optional accessible label for the table, used for both the visually hidden table caption and as aria-label on the table element.
This improves accessibility for screen readers and navigation.

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:312](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L312)

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:311](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L311)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:327](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L327)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/interface.ts:328](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L328)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:313](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L313)

***

### loadingOverlay?

> `optional` **loadingOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:341](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L341)

When true and data is already present, show a translucent overlay on top of the table
while a refetch is in flight. This avoids content jump during refresh.

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:329](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L329)

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### renderRow()?

> `optional` **renderRow**: (`row`, `index`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:326](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L326)

Optional custom row renderer. When provided, rows are rendered using this function.

#### Parameters

##### row

`T`

##### index

`number`

#### Returns

`ReactNode`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:318](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L318)

rowKey: A property name (keyof T) or a function to uniquely identify each row.
If a property name is provided, its value will be coerced to string or number.

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:336](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L336)

Number of skeleton rows to show when loading (default: 5)

***

### tableClassName?

> `optional` **tableClassName**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:322](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/shared-components/DataTable/interface.ts#L322)

Optional className applied to the underlying table element.
