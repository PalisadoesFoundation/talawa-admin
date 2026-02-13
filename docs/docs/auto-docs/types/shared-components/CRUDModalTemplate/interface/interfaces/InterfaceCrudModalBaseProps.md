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

### backdrop?

> `optional` **backdrop**: `boolean` \| `"static"`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L93)

Backdrop behavior for the modal
- 'static': clicking backdrop won't close modal
- true: clicking backdrop closes modal
- false: no backdrop

***

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L80)

Whether to center the modal vertically on the page

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L74)

Additional CSS class name for the modal

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L85)

Test ID for the modal container (useful for testing)

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L63)

Error message to display in the modal body
When provided, shows an Alert component with the error

***

### headerClassName?

> `optional` **headerClassName**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L104)

Additional CSS class name for the modal header

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L99)

Custom content for the modal header
When provided, overrides the default title and close button

***

### headerTestId?

> `optional` **headerTestId**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L109)

Test ID for the modal header (useful for testing)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L57)

Indicates whether an async operation is in progress
When true, displays a loading spinner and disables action buttons

***

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L38)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L44)

Text for the primary action button

***

### secondaryText?

> `optional` **secondaryText**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L50)

Text for the secondary action button

***

### size?

> `optional` **size**: [`ModalSize`](../type-aliases/ModalSize.md)

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L69)

Modal size variant

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L32)

Modal title displayed in the header
Can be omitted if headerContent is provided
