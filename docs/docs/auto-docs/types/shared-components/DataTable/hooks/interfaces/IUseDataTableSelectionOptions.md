[Admin Docs](/)

***

# Interface: IUseDataTableSelectionOptions\<T\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L191)

Configuration options for row selection in a DataTable.

Controls how rows can be selected, which rows are selectable,
and provides callbacks for selection changes and bulk actions.

## Type Parameters

### T

`T`

The type of row data in the table

## Properties

### bulkActions?

> `optional` **bulkActions**: readonly [`IBulkAction`](IBulkAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/hooks.ts:208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L208)

Array of bulk actions available for selected rows

***

### initialSelectedKeys?

> `optional` **initialSelectedKeys**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:206](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L206)

Initial set of selected rows on component mount

***

### keysOnPage

> **keysOnPage**: [`Key`](../../types/type-aliases/Key.md)[]

Defined in: [src/types/shared-components/DataTable/hooks.ts:195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L195)

Array of keys for rows on the current page

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/hooks.ts:204](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L204)

Callback fired when the selection changes.
Receives a new immutable set of selected keys.

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

#### Returns

`void`

***

### paginatedData

> **paginatedData**: readonly `T`[]

Defined in: [src/types/shared-components/DataTable/hooks.ts:193](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L193)

Array of rows currently shown on the page

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L197)

Whether row selection is enabled for this table

***

### selectedKeys?

> `optional` **selectedKeys**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L199)

Set of currently selected row keys
