[Admin Docs](/)

***

# Interface: InterfaceCrudModalBaseProps

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L22)

Base props shared by all CRUD modal templates

These properties are common across all modal types and provide
the fundamental functionality for opening, closing, and displaying modals.

## Extended by

- [`InterfaceCRUDModalTemplateProps`](InterfaceCRUDModalTemplateProps.md)
- [`InterfaceCreateModalProps`](InterfaceCreateModalProps.md)
- [`InterfaceEditModalProps`](InterfaceEditModalProps.md)
- [`InterfaceDeleteModalProps`](InterfaceDeleteModalProps.md)
- [`InterfaceViewModalProps`](InterfaceViewModalProps.md)

## Properties

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L79)

Whether to center the modal vertically on the page

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L73)

Additional CSS class name for the modal

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L84)

Test ID for the modal container (useful for testing)

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L62)

Error message to display in the modal body
When provided, shows an Alert component with the error

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L56)

Indicates whether an async operation is in progress
When true, displays a loading spinner and disables action buttons

***

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L37)

Callback function invoked when the modal is closed
Triggered by close button, backdrop click, or Escape key

#### Returns

`void`

***

### open?

> `optional` **open**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L26)

Controls whether the modal is visible (defaults to false)

***

### primaryText?

> `optional` **primaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L43)

Text for the primary action button

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L49)

Text for the secondary action button

***

### size?

> `optional` **size**: [`ModalSize`](../type-aliases/ModalSize.md)

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L68)

Modal size variant

***

### title

> **title**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L31)

Modal title displayed in the header
