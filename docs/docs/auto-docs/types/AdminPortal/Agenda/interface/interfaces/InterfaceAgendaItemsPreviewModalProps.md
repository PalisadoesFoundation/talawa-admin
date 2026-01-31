[Admin Docs](/)

***

# Interface: InterfaceAgendaItemsPreviewModalProps

Defined in: [src/types/AdminPortal/Agenda/interface.ts:285](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L285)

Props for the AgendaItemsPreviewModal component.

Defines the data and callback functions required to display
agenda item details in a preview modal and perform related actions
such as updating or deleting an agenda item.

## Properties

### formState

> **formState**: [`InterfaceItemFormStateType`](InterfaceItemFormStateType.md)

Defined in: [src/types/AdminPortal/Agenda/interface.ts:290](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L290)

***

### hidePreviewModal()

> **hidePreviewModal**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:287](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L287)

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:286](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L286)

***

### showUpdateItemModal()

> **showUpdateItemModal**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:288](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L288)

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:291](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L291)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteItemModal()

> **toggleDeleteItemModal**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:289](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L289)

#### Returns

`void`
