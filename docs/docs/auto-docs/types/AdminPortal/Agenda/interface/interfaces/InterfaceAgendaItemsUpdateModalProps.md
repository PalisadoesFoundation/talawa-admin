[Admin Docs](/)

***

# Interface: InterfaceAgendaItemsUpdateModalProps

Defined in: [src/types/AdminPortal/Agenda/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L58)

## Properties

### agendaItemCategories

> **agendaItemCategories**: [`InterfaceAgendaItemCategoryInfo`](InterfaceAgendaItemCategoryInfo.md)[]

Defined in: [src/types/AdminPortal/Agenda/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L65)

***

### agendaItemUpdateModalIsOpen

> **agendaItemUpdateModalIsOpen**: `boolean`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L59)

***

### formState

> **formState**: [`InterfaceFormStateType`](InterfaceFormStateType.md)

Defined in: [src/types/AdminPortal/Agenda/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L61)

***

### hideUpdateModal()

> **hideUpdateModal**: () => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L60)

#### Returns

`void`

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L62)

#### Parameters

##### state

`SetStateAction`\<[`InterfaceFormStateType`](InterfaceFormStateType.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/AdminPortal/Agenda/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Agenda/interface.ts#L64)

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

`ChangeEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>
