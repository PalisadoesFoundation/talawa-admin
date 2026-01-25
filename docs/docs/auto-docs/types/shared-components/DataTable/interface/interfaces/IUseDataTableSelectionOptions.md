[Admin Docs](/)

***

# Interface: IUseDataTableSelectionOptions\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:748](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L748)

Options for the useDataTableSelection hook.

Configures selection behavior for DataTable.

## Type Parameters

### T

`T`

The row data type

## Properties

### bulkActions?

> `optional` **bulkActions**: readonly [`IBulkAction`](IBulkAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:762](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L762)

Bulk action definitions

***

### initialSelectedKeys?

> `optional` **initialSelectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:760](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L760)

Initial selected keys for uncontrolled mode

***

### keysOnPage

> **keysOnPage**: [`Key`](../type-aliases/Key.md)[]

Defined in: [src/types/shared-components/DataTable/interface.ts:752](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L752)

Keys of rows on the current page

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:758](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L758)

Callback when selection changes

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

#### Returns

`void`

***

### paginatedData

> **paginatedData**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:750](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L750)

Current page data

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:754](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L754)

Whether selection is enabled

***

### selectedKeys?

> `optional` **selectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:756](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L756)

Controlled selected keys
