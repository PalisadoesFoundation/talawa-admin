[**talawa-admin**](README.md)

***

# Interface: InterfaceAgendaItemsUpdateModalProps

Defined in: [src/types/Agenda/interface.ts:58](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L58)

## Properties

### agendaItemCategories

> **agendaItemCategories**: [`InterfaceAgendaItemCategoryInfo`](types\Agenda\interface\README\interfaces\InterfaceAgendaItemCategoryInfo.md)[]

Defined in: [src/types/Agenda/interface.ts:65](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L65)

***

### agendaItemUpdateModalIsOpen

> **agendaItemUpdateModalIsOpen**: `boolean`

Defined in: [src/types/Agenda/interface.ts:59](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L59)

***

### formState

> **formState**: [`InterfaceFormStateType`](types\Agenda\interface\README\interfaces\InterfaceFormStateType.md)

Defined in: [src/types/Agenda/interface.ts:61](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L61)

***

### hideUpdateModal()

> **hideUpdateModal**: () => `void`

Defined in: [src/types/Agenda/interface.ts:60](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L60)

#### Returns

`void`

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Agenda/interface.ts:62](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L62)

#### Parameters

##### state

`SetStateAction`\<[`InterfaceFormStateType`](types\Agenda\interface\README\interfaces\InterfaceFormStateType.md)\>

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Agenda/interface.ts:64](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L64)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### updateAgendaItemHandler()

> **updateAgendaItemHandler**: (`e`) => `Promise`\<`void`\>

Defined in: [src/types/Agenda/interface.ts:63](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Agenda/interface.ts#L63)

#### Parameters

##### e

`ChangeEvent`\<`HTMLFormElement`\>

#### Returns

`Promise`\<`void`\>
