[**talawa-admin**](../../../../../README.md)

***

# Interface: IRowAction\<T\>

Defined in: [src/types/shared-components/DataTable/interface.ts:546](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L546)

Row-level action definition for per-row action buttons.

## Example

```ts
const rowActions: IRowAction<User>[] = [
  { id: 'edit', label: 'Edit', onClick: (row) => console.log('edit', row.id) },
  { id: 'delete', label: 'Delete', onClick: (row) => console.log('delete', row.id), disabled: (row) => row.isAdmin },
];
```

## Type Parameters

### T

`T`

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:556](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L556)

Accessible label for screen readers

***

### disabled?

> `optional` **disabled**: `boolean` \| (`row`) => `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:554](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L554)

Disable this action (boolean or function returning boolean)

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:548](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L548)

Unique identifier for the action

***

### label

> **label**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:550](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L550)

Button label text

***

### onClick()

> **onClick**: (`row`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:552](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L552)

Callback when action is triggered

#### Parameters

##### row

`T`

#### Returns

`void`
