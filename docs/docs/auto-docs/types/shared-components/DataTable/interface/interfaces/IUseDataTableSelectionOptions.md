[**talawa-admin**](../../../../../README.md)

***

# Interface: IUseDataTableSelectionOptions\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:677](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L677)

Options for the useDataTableSelection hook.

Configures selection behavior for DataTable.

## Type Parameters

### T

`T`

The row data type

## Properties

### bulkActions?

> `optional` **bulkActions**: readonly [`IBulkAction`](IBulkAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:691](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L691)

Bulk action definitions

***

### initialSelectedKeys?

> `optional` **initialSelectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:689](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L689)

Initial selected keys for uncontrolled mode

***

### keysOnPage

> **keysOnPage**: [`Key`](../type-aliases/Key.md)[]

Defined in: [src/types/shared-components/DataTable/interface.ts:681](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L681)

Keys of rows on the current page

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:687](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L687)

Callback when selection changes

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

#### Returns

`void`

***

### paginatedData

> **paginatedData**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:679](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L679)

Current page data

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:683](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L683)

Whether selection is enabled

***

### selectedKeys?

> `optional` **selectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:685](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L685)

Controlled selected keys
