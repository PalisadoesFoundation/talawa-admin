[**talawa-admin**](../../../../../README.md)

***

# Interface: IBaseDataTableProps\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/interface.ts:309](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L309)

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:325](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L325)

Optional accessible label for the table, used for both the visually hidden table caption and as aria-label on the table element.
This improves accessibility for screen readers and navigation.

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:311](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L311)

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:310](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L310)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:318](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L318)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/interface.ts:319](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L319)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:312](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L312)

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:320](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L320)

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:317](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L317)

rowKey: A property name (keyof T) or a function to uniquely identify each row.
If a property name is provided, its value will be coerced to string or number.

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:327](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/DataTable/interface.ts#L327)

Number of skeleton rows to show when loading (default: 6)
