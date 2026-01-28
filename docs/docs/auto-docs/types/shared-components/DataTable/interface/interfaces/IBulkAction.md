[**talawa-admin**](../../../../../README.md)

***

# Interface: IBulkAction\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:570](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L570)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:580](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L580)

Optional confirmation message shown before executing the action

***

### disabled?

> `optional` **disabled**: `boolean` \| (`rows`, `keys`) => `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:578](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L578)

Disable this action (boolean or function returning boolean based on selection)

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:572](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L572)

Unique identifier for the action

***

### label

> **label**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:574](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L574)

Button label text

***

### onClick()

> **onClick**: (`rows`, `keys`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:576](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L576)

Callback when action is triggered with selected rows and their keys

#### Parameters

##### rows

`T`[]

##### keys

[`Key`](../type-aliases/Key.md)[]

#### Returns

`void` \| `Promise`\<`void`\>
