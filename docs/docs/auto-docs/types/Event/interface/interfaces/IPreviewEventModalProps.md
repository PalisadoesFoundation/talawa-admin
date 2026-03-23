[Admin Docs](/)

***

# Interface: IPreviewEventModalProps

Defined in: [src/types/Event/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L164)

## Properties

### allDayChecked

> **allDayChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L175)

***

### customRecurrenceModalIsOpen?

> `optional` **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:202](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L202)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:172](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L172)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L165)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L166)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L171)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L183)

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

Defined in: [src/types/Event/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L198)

#### Returns

`Promise`\<`void`\>

***

### hideCustomRecurrenceModal()?

> `optional` **hideCustomRecurrenceModal**: () => `void`

Defined in: [src/types/Event/interface.ts:206](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L206)

#### Returns

`void`

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L167)

#### Returns

`void`

***

### inviteOnlyChecked

> **inviteOnlyChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:181](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L181)

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L169)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L199)

#### Returns

`void`

***

### publicChecked

> **publicChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L177)

***

### recurrence

> **recurrence**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L200)

***

### registerableChecked

> **registerableChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:179](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L179)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L197)

#### Returns

`Promise`\<`void`\>

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L176)

***

### setCustomRecurrenceModalIsOpen()?

> `optional` **setCustomRecurrenceModalIsOpen**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L203)

#### Parameters

##### state

`boolean` | (`prev`) => `boolean`

#### Returns

`void`

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L174)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L173)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:190](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L190)

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

Defined in: [src/types/Event/interface.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L182)

***

### setPublicChecked

> **setPublicChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L178)

***

### setRecurrence

> **setRecurrence**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>\>

Defined in: [src/types/Event/interface.ts:201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L201)

***

### setRegisterableChecked

> **setRegisterableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L180)

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L168)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L170)
