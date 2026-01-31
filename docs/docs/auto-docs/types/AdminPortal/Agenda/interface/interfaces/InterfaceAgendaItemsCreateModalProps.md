[Admin Docs](/)

***

# Interface: InterfaceAgendaItemsCreateModalProps

Defined in: [src/types/AdminPortal/Agenda/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L37)

## Properties

### agendaItemCategories

> **agendaItemCategories**: [`InterfaceAgendaItemCategoryInfo`](InterfaceAgendaItemCategoryInfo.md)[]

Defined in: [src/types/AdminPortal/Agenda/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L46)

***

### agendaItemCreateModalIsOpen

> **agendaItemCreateModalIsOpen**: `boolean`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L38)

***

### createAgendaItemHandler()

> **createAgendaItemHandler**: (`e`) => `Promise`\<`void`\>

Defined in: [src/types/AdminPortal/Agenda/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L44)

#### Parameters

##### e

`ChangeEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>

***

### formState

> **formState**: [`InterfaceCreateFormStateType`](InterfaceCreateFormStateType.md)

Defined in: [src/types/AdminPortal/Agenda/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L40)

***

### hideCreateModal()

> **hideCreateModal**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L39)

#### Returns

`void`

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L41)

#### Parameters

##### state

`SetStateAction`\<[`InterfaceCreateFormStateType`](InterfaceCreateFormStateType.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L45)

#### Parameters

##### key

`string`

#### Returns

`string`
