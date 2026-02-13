[Admin Docs](/)

***

# Interface: InterfaceCRUDModalTemplateProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L117)

Props for the base CRUDModalTemplate component

This is the foundation component that all specialized modal templates build upon.

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L121)

Content to render inside the modal body

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L74)

Additional CSS class name for the modal

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`className`](InterfaceCrudModalBaseProps.md#classname)

***

### customFooter?

> `optional` **customFooter**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L153)

Custom footer content to replace the default action buttons
When provided, primaryText, secondaryText, and onPrimary are ignored
Alias: footer

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L85)

Test ID for the modal container (useful for testing)

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`data-testid`](InterfaceCrudModalBaseProps.md#data-testid)

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L63)

Error message to display in the modal body
When provided, shows an Alert component with the error

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`error`](InterfaceCrudModalBaseProps.md#error)

***

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L159)

Custom footer content (alias for customFooter)
Provided for compatibility with BaseModal

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

### hideSecondary?

> `optional` **hideSecondary**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L146)

Whether to hide the secondary (cancel) button

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

### onPrimary()?

> `optional` **onPrimary**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L127)

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

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`open`](InterfaceCrudModalBaseProps.md#open)

***

### primaryDisabled?

> `optional` **primaryDisabled**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L140)

Whether to disable the primary button
Automatically disabled when loading is true

***

### primaryText?

> `optional` **primaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L44)

Text for the primary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`primaryText`](InterfaceCrudModalBaseProps.md#primarytext)

***

### primaryVariant?

> `optional` **primaryVariant**: `"primary"` \| `"success"` \| `"danger"`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L133)

Variant style for the primary button

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L50)

Text for the secondary action button

#### Inherited from

[`InterfaceCrudModalBaseProps`](InterfaceCrudModalBaseProps.md).[`secondaryText`](InterfaceCrudModalBaseProps.md#secondarytext)

***

### showFooter?

> `optional` **showFooter**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L165)

Whether to show the modal footer at all

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
