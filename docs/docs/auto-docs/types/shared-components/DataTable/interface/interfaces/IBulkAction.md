[Admin Docs](/)

***

# Interface: IBulkAction\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:641](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L641)

Bulk action for operations on multiple selected rows.

## Example

```ts
const bulkActions: IBulkAction<User>[] = [
  { id: 'export', label: 'Export', onClick: (rows, keys) => console.log('export', keys) },
  { id: 'delete', label: 'Delete', onClick: (rows, keys) => console.log('delete', keys), confirm: 'Delete selected items?' },
];
```

## Type Parameters

### T

`T`

## Properties

### confirm?

> `optional` **confirm**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:651](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L651)

Optional confirmation message shown before executing the action

***

### disabled?

> `optional` **disabled**: `boolean` \| (`rows`, `keys`) => `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:649](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L649)

Disable this action (boolean or function returning boolean based on selection)

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:643](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L643)

Unique identifier for the action

***

### label

> **label**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:645](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L645)

Button label text

***

### onClick()

> **onClick**: (`rows`, `keys`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:647](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L647)

Callback when action is triggered with selected rows and their keys

#### Parameters

##### rows

`T`[]

##### keys

[`Key`](../type-aliases/Key.md)[]

#### Returns

`void` \| `Promise`\<`void`\>
