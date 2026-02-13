[Admin Docs](/)

***

# Interface: InterfaceDeleteModalProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:230](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L230)

Props for DeleteModal template

Specialized template for delete confirmation dialogs.

## Extends

- [`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md)

## Properties

### backdrop?

> `optional` **backdrop**: `boolean` \| `"static"`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L93)

Backdrop behavior for the modal
- 'static': clicking backdrop won't close modal
- true: clicking backdrop closes modal
- false: no backdrop

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`backdrop`](InterfaceCrudModalBaseProps.md#backdrop)

***

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L80)

Whether to center the modal vertically on the page

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`centered`](InterfaceCrudModalBaseProps.md#centered)

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:235](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L235)

Optional custom content to display in the modal body
If not provided, shows the confirmationMessage

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L74)

Additional CSS class name for the modal

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`className`](InterfaceCrudModalBaseProps.md#classname)

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L85)

Test ID for the modal container (useful for testing)

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`data-testid`](InterfaceCrudModalBaseProps.md#data-testid)

***

### entityName?

> `optional` **entityName**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L247)

Name of the entity being deleted (for display purposes)
When provided, will be shown in the confirmation message

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L63)

Error message to display in the modal body
When provided, shows an Alert component with the error

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`error`](InterfaceCrudModalBaseProps.md#error)

***

### headerClassName?

> `optional` **headerClassName**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L104)

Additional CSS class name for the modal header

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`headerClassName`](InterfaceCrudModalBaseProps.md#headerclassname)

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L99)

Custom content for the modal header
When provided, overrides the default title and close button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`headerContent`](InterfaceCrudModalBaseProps.md#headercontent)

***

### headerTestId?

> `optional` **headerTestId**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L109)

Test ID for the modal header (useful for testing)

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`headerTestId`](InterfaceCrudModalBaseProps.md#headertestid)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L57)

Indicates whether an async operation is in progress
When true, displays a loading spinner and disables action buttons

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`loading`](InterfaceCrudModalBaseProps.md#loading)

***

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L38)

Callback function invoked when the modal is closed
Triggered by close button, backdrop click, or Escape key

#### Returns

`void`

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`onClose`](InterfaceCrudModalBaseProps.md#onclose)

***

### onDelete()

> **onDelete**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:241](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L241)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L44)

Text for the primary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`primaryText`](InterfaceCrudModalBaseProps.md#primarytext)

***

### recurringEventContent?

> `optional` **recurringEventContent**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:259](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L259)

Optional content to display for recurring event support
Allows users to choose between deleting series or single instance

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L50)

Text for the secondary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`secondaryText`](InterfaceCrudModalBaseProps.md#secondarytext)

***

### showWarning?

> `optional` **showWarning**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:253](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L253)

Whether to show warning styling (danger variant)

***

### size?

> `optional` **size**: [`ModalSize`](../type-aliases/ModalSize.md)

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L69)

Modal size variant

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`size`](InterfaceCrudModalBaseProps.md#size)

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L32)

Modal title displayed in the header
Can be omitted if headerContent is provided

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`title`](InterfaceCrudModalBaseProps.md#title)
