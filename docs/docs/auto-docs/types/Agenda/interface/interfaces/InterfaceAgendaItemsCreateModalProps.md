[Admin Docs](/)

***

# Interface: InterfaceAgendaItemsCreateModalProps

Defined in: [src/types/Agenda/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L36)

## Properties

### agendaItemCategories

> **agendaItemCategories**: [`InterfaceAgendaItemCategoryInfo`](InterfaceAgendaItemCategoryInfo.md)[]

Defined in: [src/types/Agenda/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L45)

***

### agendaItemCreateModalIsOpen

> **agendaItemCreateModalIsOpen**: `boolean`

Defined in: [src/types/Agenda/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L37)

***

### createAgendaItemHandler()

> **createAgendaItemHandler**: (`e`) => `Promise`\<`void`\>

Defined in: [src/types/Agenda/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L43)

#### Parameters

##### e

`ChangeEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>

***

### formState

> **formState**: [`InterfaceCreateFormStateType`](InterfaceCreateFormStateType.md)

Defined in: [src/types/Agenda/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L39)

***

### hideCreateModal()

> **hideCreateModal**: () => `void`

Defined in: [src/types/Agenda/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L38)

#### Returns

`void`

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Agenda/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L40)

#### Parameters

##### state

`SetStateAction`\<[`InterfaceCreateFormStateType`](InterfaceCreateFormStateType.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Agenda/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Agenda/interface.ts#L44)

#### Parameters

##### key

`string`

#### Returns

`string`
