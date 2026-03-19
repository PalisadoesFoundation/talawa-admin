[Admin Docs](/)

***

# Interface: InterfaceCRUDModalTemplateProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L92)

Props for the base CRUDModalTemplate component

This is the foundation component that all specialized modal templates build upon.

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L96)

Content to render inside the modal body

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L73)

Additional CSS class name for the modal

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`className`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#classname)

***

### customFooter?

> `optional` **customFooter**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L127)

Custom footer content to replace the default action buttons
When provided, primaryText, secondaryText, and onPrimary are ignored

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

### hideSecondary?

> `optional` **hideSecondary**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L121)

Whether to hide the secondary (cancel) button

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

### onPrimary()?

> `optional` **onPrimary**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L102)

Callback function for the primary action button
If not provided, the primary button will not be rendered

#### Returns

`void`

***

### open?

> `optional` **open**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L26)

Controls whether the modal is visible (defaults to false)

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`open`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#open)

***

### primaryDisabled?

> `optional` **primaryDisabled**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L115)

Whether to disable the primary button
Automatically disabled when loading is true

***

### primaryText?

> `optional` **primaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L43)

Text for the primary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`primaryText`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#primarytext)

***

### primaryVariant?

> `optional` **primaryVariant**: `"primary"` \| `"success"` \| `"danger"`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L108)

Variant style for the primary button

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L49)

Text for the secondary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md).[`secondaryText`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceCrudModalBaseProps.md#secondarytext)

***

### showFooter?

> `optional` **showFooter**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L133)

Whether to show the modal footer at all

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
