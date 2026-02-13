[Admin Docs](/)

***

# Interface: IRowAction\<T\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L130)

Configuration for an action available on individual table rows.

Row actions appear as contextual buttons or menu items for each row,
allowing users to perform operations on specific row data.

## Type Parameters

### T

`T`

The type of row data this action operates on

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L147)

ARIA label for accessibility when label alone is not descriptive

***

### disabled?

> `optional` **disabled**: `boolean` \| (`row`) => `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L145)

Whether this action is disabled.
Can be a boolean or a function that evaluates the row to determine disabled state.

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L132)

Unique identifier for this action

***

### label

> **label**: `string`

Defined in: [src/types/shared-components/DataTable/hooks.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L134)

Display label for the action button or menu item

***

### onClick()

> **onClick**: (`row`) => `void`

Defined in: [src/types/shared-components/DataTable/hooks.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L140)

Callback fired when the action is triggered on a row.

#### Parameters

##### row

`T`

The row data the action was triggered for

#### Returns

`void`
