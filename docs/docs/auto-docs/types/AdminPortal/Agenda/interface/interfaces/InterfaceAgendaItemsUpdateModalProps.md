[Admin Docs](/)

***

# Interface: InterfaceAgendaItemsUpdateModalProps

Defined in: [src/types/AdminPortal/Agenda/interface.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L180)

Props for the AgendaItemsUpdateModal component.

## Properties

### agendaFolderData

> **agendaFolderData**: [`InterfaceAgendaFolderInfo`](InterfaceAgendaFolderInfo.md)[]

Defined in: [src/types/AdminPortal/Agenda/interface.ts:190](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L190)

***

### agendaItemCategories

> **agendaItemCategories**: [`InterfaceAgendaItemCategoryInfo`](InterfaceAgendaItemCategoryInfo.md)[]

Defined in: [src/types/AdminPortal/Agenda/interface.ts:189](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L189)

***

### agendaItemId

> **agendaItemId**: `string`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L183)

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:181](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L181)

***

### itemFormState

> **itemFormState**: [`InterfaceFormStateType`](InterfaceFormStateType.md)

Defined in: [src/types/AdminPortal/Agenda/interface.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L184)

***

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L182)

#### Returns

`void`

***

### refetchAgendaFolder()

> **refetchAgendaFolder**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L191)

#### Returns

`void`

***

### setItemFormState()

> **setItemFormState**: (`state`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L185)

#### Parameters

##### state

`SetStateAction`\<[`InterfaceFormStateType`](InterfaceFormStateType.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:188](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L188)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### updateAgendaItemHandler()

> **updateAgendaItemHandler**: (`e`) => `Promise`\<`void`\>

Defined in: [src/types/AdminPortal/Agenda/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L63)

#### Parameters

##### e

`FormEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>
