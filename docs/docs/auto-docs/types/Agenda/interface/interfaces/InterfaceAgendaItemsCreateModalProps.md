[Admin Docs](/)

***

# Interface: InterfaceAgendaItemsCreateModalProps

Defined in: src/types/Agenda/interface.ts:37

## Properties

### agendaItemCategories

> **agendaItemCategories**: [`InterfaceAgendaItemCategoryInfo`](InterfaceAgendaItemCategoryInfo.md)[]

Defined in: src/types/Agenda/interface.ts:46

***

### agendaItemCreateModalIsOpen

> **agendaItemCreateModalIsOpen**: `boolean`

Defined in: src/types/Agenda/interface.ts:38

***

### createAgendaItemHandler()

> **createAgendaItemHandler**: (`e`) => `Promise`\<`void`\>

Defined in: src/types/Agenda/interface.ts:44

#### Parameters

##### e

`ChangeEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>

***

### formState

> **formState**: [`InterfaceCreateFormStateType`](InterfaceCreateFormStateType.md)

Defined in: src/types/Agenda/interface.ts:40

***

### hideCreateModal()

> **hideCreateModal**: () => `void`

Defined in: src/types/Agenda/interface.ts:39

#### Returns

`void`

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: src/types/Agenda/interface.ts:41

#### Parameters

##### state

`SetStateAction`\<[`InterfaceCreateFormStateType`](InterfaceCreateFormStateType.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: src/types/Agenda/interface.ts:45

#### Parameters

##### key

`string`

#### Returns

`string`
