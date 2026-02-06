[Admin Docs](/)

***

# Interface: InterfaceDeleteModalProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L208)

Props for DeleteModal template

Specialized template for delete confirmation dialogs.

## Extends

- [`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md)

## Properties

### bodyClassName?

> `optional` **bodyClassName**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L83)

Additional CSS class name for the modal body

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`bodyClassName`](InterfaceCrudModalBaseProps.md#bodyclassname)

***

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L89)

Whether to center the modal vertically on the page

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`centered`](InterfaceCrudModalBaseProps.md#centered)

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:213](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L213)

Optional custom content to display in the modal body
If not provided, shows the confirmationMessage

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L73)

Additional CSS class name for the modal

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`className`](InterfaceCrudModalBaseProps.md#classname)

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L94)

Test ID for the modal container (useful for testing)

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`data-testid`](InterfaceCrudModalBaseProps.md#data-testid)

***

### entityName?

> `optional` **entityName**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:225](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L225)

Name of the entity being deleted (for display purposes)
When provided, will be shown in the confirmation message

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L62)

Error message to display in the modal body
When provided, shows an Alert component with the error

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`error`](InterfaceCrudModalBaseProps.md#error)

***

### headerClassName?

> `optional` **headerClassName**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L78)

Additional CSS class name for the modal header

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`headerClassName`](InterfaceCrudModalBaseProps.md#headerclassname)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L56)

Indicates whether an async operation is in progress
When true, displays a loading spinner and disables action buttons

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`loading`](InterfaceCrudModalBaseProps.md#loading)

***

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L37)

Callback function invoked when the modal is closed
Triggered by close button, backdrop click, or Escape key

#### Returns

`void`

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`onClose`](InterfaceCrudModalBaseProps.md#onclose)

***

### onDelete()

> **onDelete**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:219](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L219)

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

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`open`](InterfaceCrudModalBaseProps.md#open)

***

### primaryText?

> `optional` **primaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L43)

Text for the primary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`primaryText`](InterfaceCrudModalBaseProps.md#primarytext)

***

### recurringEventContent?

> `optional` **recurringEventContent**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:237](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L237)

Optional content to display for recurring event support
Allows users to choose between deleting series or single instance

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L49)

Text for the secondary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`secondaryText`](InterfaceCrudModalBaseProps.md#secondarytext)

***

### showWarning?

> `optional` **showWarning**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:231](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L231)

Whether to show warning styling (danger variant)

***

### size?

> `optional` **size**: [`ModalSize`](../type-aliases/ModalSize.md)

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L68)

Modal size variant

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`size`](InterfaceCrudModalBaseProps.md#size)

***

### title

> **title**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L31)

Modal title displayed in the header

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`title`](InterfaceCrudModalBaseProps.md#title)
