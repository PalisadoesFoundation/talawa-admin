[Admin Docs](/)

***

# Interface: InterfaceCRUDModalTemplateProps

Defined in: [src/types/CRUDModalTemplate/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L98)

Props for the base CRUDModalTemplate component

This is the foundation component that all specialized modal templates build upon.

## Extends

- [`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md)

## Properties

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L85)

Whether to center the modal vertically on the page

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`centered`](InterfaceCrudModalBaseProps.md#centered)

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/types/CRUDModalTemplate/interface.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L103)

Content to render inside the modal body

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/CRUDModalTemplate/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L79)

Additional CSS class name for the modal

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`className`](InterfaceCrudModalBaseProps.md#classname)

***

### customFooter?

> `optional` **customFooter**: `ReactNode`

Defined in: [src/types/CRUDModalTemplate/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L134)

Custom footer content to replace the default action buttons
When provided, primaryText, secondaryText, and onPrimary are ignored

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/CRUDModalTemplate/interface.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L90)

Test ID for the modal container (useful for testing)

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`data-testid`](InterfaceCrudModalBaseProps.md#data-testid)

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/CRUDModalTemplate/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L68)

Error message to display in the modal body
When provided, shows an Alert component with the error

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`error`](InterfaceCrudModalBaseProps.md#error)

***

### hideSecondary?

> `optional` **hideSecondary**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L128)

Whether to hide the secondary (cancel) button

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L62)

Indicates whether an async operation is in progress
When true, displays a loading spinner and disables action buttons

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`loading`](InterfaceCrudModalBaseProps.md#loading)

***

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/CRUDModalTemplate/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L43)

Callback function invoked when the modal is closed
Triggered by close button, backdrop click, or Escape key

#### Returns

`void`

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`onClose`](InterfaceCrudModalBaseProps.md#onclose)

***

### onPrimary()?

> `optional` **onPrimary**: () => `void`

Defined in: [src/types/CRUDModalTemplate/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L109)

Callback function for the primary action button
If not provided, the primary button will not be rendered

#### Returns

`void`

***

### open?

> `optional` **open**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L26)

Controls whether the modal is visible (defaults to false)

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`open`](InterfaceCrudModalBaseProps.md#open)

***

### primaryDisabled?

> `optional` **primaryDisabled**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L122)

Whether to disable the primary button
Automatically disabled when loading is true

***

### primaryText?

> `optional` **primaryText**: `string`

Defined in: [src/types/CRUDModalTemplate/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L49)

Text for the primary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`primaryText`](InterfaceCrudModalBaseProps.md#primarytext)

***

### primaryVariant?

> `optional` **primaryVariant**: `"primary"` \| `"success"` \| `"danger"`

Defined in: [src/types/CRUDModalTemplate/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L115)

Variant style for the primary button

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/CRUDModalTemplate/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L55)

Text for the secondary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`secondaryText`](InterfaceCrudModalBaseProps.md#secondarytext)

***

### show?

> `optional` **show**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L32)

Alternative prop name for modal visibility (for compatibility).
If both `open` and `show` are provided, `open` takes precedence (defaults to false)

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`show`](InterfaceCrudModalBaseProps.md#show)

***

### showFooter?

> `optional` **showFooter**: `boolean`

Defined in: [src/types/CRUDModalTemplate/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L140)

Whether to show the modal footer at all

***

### size?

> `optional` **size**: [`ModalSize`](../type-aliases/ModalSize.md)

Defined in: [src/types/CRUDModalTemplate/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L74)

Modal size variant

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`size`](InterfaceCrudModalBaseProps.md#size)

***

### title

> **title**: `string`

Defined in: [src/types/CRUDModalTemplate/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CRUDModalTemplate/interface.ts#L37)

Modal title displayed in the header

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`title`](InterfaceCrudModalBaseProps.md#title)
