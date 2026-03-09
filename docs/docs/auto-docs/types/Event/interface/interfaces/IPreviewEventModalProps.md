[Admin Docs](/)

***

# Interface: IPreviewEventModalProps

Defined in: [src/types/Event/interface.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L149)

## Properties

### allDayChecked

> **allDayChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L160)

***

### customRecurrenceModalIsOpen?

> `optional` **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:187](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L187)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L157)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L150)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L151)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L156)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L168)

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

Defined in: [src/types/Event/interface.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L183)

#### Returns

`Promise`\<`void`\>

***

### hideCustomRecurrenceModal()?

> `optional` **hideCustomRecurrenceModal**: () => `void`

Defined in: [src/types/Event/interface.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L191)

#### Returns

`void`

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L152)

#### Returns

`void`

***

### inviteOnlyChecked

> **inviteOnlyChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L166)

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L154)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L184)

#### Returns

`void`

***

### publicChecked

> **publicChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L162)

***

### recurrence

> **recurrence**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L185)

***

### registerableChecked

> **registerableChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L164)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L182)

#### Returns

`Promise`\<`void`\>

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L161)

***

### setCustomRecurrenceModalIsOpen()?

> `optional` **setCustomRecurrenceModalIsOpen**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:188](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L188)

#### Parameters

##### state

`boolean` | (`prev`) => `boolean`

#### Returns

`void`

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L159)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L158)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L175)

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

Defined in: [src/types/Event/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L167)

***

### setPublicChecked

> **setPublicChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L163)

***

### setRecurrence

> **setRecurrence**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>\>

Defined in: [src/types/Event/interface.ts:186](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L186)

***

### setRegisterableChecked

> **setRegisterableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L165)

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L153)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L155)
