[Admin Docs](/)

***

# Interface: InterfaceDeleteModalProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L198)

Props for DeleteModal template

Specialized template for delete confirmation dialogs.

## Extends

- [`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md)

## Properties

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L79)

Whether to center the modal vertically on the page

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`centered`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#centered)

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L203)

Optional custom content to display in the modal body
If not provided, shows the confirmationMessage

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L73)

Additional CSS class name for the modal

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`className`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#classname)

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L84)

Test ID for the modal container (useful for testing)

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`data-testid`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#data-testid)

***

### entityName?

> `optional` **entityName**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:215](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L215)

Name of the entity being deleted (for display purposes)
When provided, will be shown in the confirmation message

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L62)

Error message to display in the modal body
When provided, shows an Alert component with the error

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`error`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#error)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L56)

Indicates whether an async operation is in progress
When true, displays a loading spinner and disables action buttons

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`loading`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#loading)

***

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L37)

Callback function invoked when the modal is closed
Triggered by close button, backdrop click, or Escape key

#### Returns

`void`

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`onClose`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#onclose)

***

### onDelete()

> **onDelete**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:209](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L209)

Callback function invoked when deletion is confirmed
Should handle the delete logic and return a Promise

#### Returns

`void` \| `Promise`\<`void`\>

***

### open?

> `optional` **open**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L26)

Controls whether the modal is visible (defaults to false)

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`open`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#open)

***

### primaryText?

> `optional` **primaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L43)

Text for the primary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`primaryText`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#primarytext)

***

### recurringEventContent?

> `optional` **recurringEventContent**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:227](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L227)

Optional content to display for recurring event support
Allows users to choose between deleting series or single instance

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L49)

Text for the secondary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`secondaryText`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#secondarytext)

***

### showWarning?

> `optional` **showWarning**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:221](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L221)

Whether to show warning styling (danger variant)

***

### size?

> `optional` **size**: [`ModalSize`](types\shared-components\CRUDModalTemplate\interface\README\type-aliases\ModalSize.md)

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L68)

Modal size variant

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`size`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#size)

***

### title

> **title**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L31)

Modal title displayed in the header

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`title`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#title)
