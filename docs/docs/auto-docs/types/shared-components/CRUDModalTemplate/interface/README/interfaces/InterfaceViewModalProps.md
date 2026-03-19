[Admin Docs](/)

***

# Interface: InterfaceViewModalProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:236](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L236)

Props for ViewModal template

Specialized template for read-only entity display.
Parent component handles data fetching and passes formatted content as children.

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

### children

> **children**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:241](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L241)

Content to display in the modal body
Parent should pass formatted data display as children

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L73)

Additional CSS class name for the modal

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`className`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#classname)

***

### customActions?

> `optional` **customActions**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:252](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L252)

Optional custom action buttons to display in the footer
Useful for actions like "Edit" or "Delete" from the view modal

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L84)

Test ID for the modal container (useful for testing)

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`data-testid`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#data-testid)

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

### loadingData?

> `optional` **loadingData**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:246](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L246)

Whether data is currently being loaded

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

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L49)

Text for the secondary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`secondaryText`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#secondarytext)

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
