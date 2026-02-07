[Admin Docs](/)

***

# Interface: IBulkAction\<T\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L160)

Configuration for an action available on bulk-selected rows.

Bulk actions operate on multiple selected rows at once and typically
involve server mutations or data processing.

## Type Parameters

### T

`T`

The type of row data this action operates on

## Properties

### confirm?

> `optional` **confirm**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L182)

Optional confirmation message to display before executing the action

***

### disabled?

> `optional` **disabled**: `boolean` \| (`rows`, `keys`) => `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L180)

Whether this action is disabled for the current selection.
Can be a boolean or a function that evaluates the selection.

#### Param

Array of selected rows

#### Param

Array of keys for the selected rows

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L162)

Unique identifier for this action

***

### label

> **label**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L164)

Display label for the bulk action button

***

### onClick()

> **onClick**: (`rows`, `keys`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L173)

Callback fired when the bulk action is triggered.
Can be async to support server operations.

#### Parameters

##### rows

`T`[]

Array of selected rows

##### keys

[`Key`](../../types/type-aliases/Key.md)[]

Array of keys for the selected rows

#### Returns

`void` \| `Promise`\<`void`\>

`void` or `Promise<void>` if async
