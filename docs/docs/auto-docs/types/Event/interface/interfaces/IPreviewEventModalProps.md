[Admin Docs](/)

***

# Interface: IPreviewEventModalProps

Defined in: [src/types/Event/interface.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L160)

## Properties

### allDayChecked

> **allDayChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L171)

***

### customRecurrenceModalIsOpen?

> `optional` **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L198)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L168)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L161)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L162)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L167)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:179](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L179)

#### endTime

> **endTime**: `string`

#### eventDescription

> **eventDescription**: `string`

#### location

> **location**: `string`

#### name

> **name**: `string`

#### startTime

> **startTime**: `string`

***

### handleEventUpdate()

> **handleEventUpdate**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:194](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L194)

#### Returns

`Promise`\<`void`\>

***

### hideCustomRecurrenceModal()?

> `optional` **hideCustomRecurrenceModal**: () => `void`

Defined in: [src/types/Event/interface.ts:202](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L202)

#### Returns

`void`

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L163)

#### Returns

`void`

***

### inviteOnlyChecked

> **inviteOnlyChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L177)

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L165)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L195)

#### Returns

`void`

***

### publicChecked

> **publicChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L173)

***

### recurrence

> **recurrence**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:196](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L196)

***

### registerableChecked

> **registerableChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L175)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:193](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L193)

#### Returns

`Promise`\<`void`\>

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:172](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L172)

***

### setCustomRecurrenceModalIsOpen()?

> `optional` **setCustomRecurrenceModalIsOpen**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L199)

#### Parameters

##### state

`boolean` | (`prev`) => `boolean`

#### Returns

`void`

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L170)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L169)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:186](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L186)

#### Parameters

##### state

###### endTime

`string`

###### eventDescription

`string`

###### location

`string`

###### name

`string`

###### startTime

`string`

#### Returns

`void`

***

### setInviteOnlyChecked

> **setInviteOnlyChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L178)

***

### setPublicChecked

> **setPublicChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L174)

***

### setRecurrence

> **setRecurrence**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>\>

Defined in: [src/types/Event/interface.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L197)

***

### setRegisterableChecked

> **setRegisterableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L176)

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L164)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L166)
