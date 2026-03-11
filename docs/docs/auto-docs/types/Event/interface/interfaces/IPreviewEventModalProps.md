[Admin Docs](/)

***

# Interface: IPreviewEventModalProps

Defined in: [src/types/Event/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L152)

## Properties

### allDayChecked

> **allDayChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L165)

***

### customRecurrenceModalIsOpen

> **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L192)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L162)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L153)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L154)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L161)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L173)

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

Defined in: [src/types/Event/interface.ts:188](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L188)

#### Returns

`Promise`\<`void`\>

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L155)

#### Returns

`void`

***

### inviteOnlyChecked

> **inviteOnlyChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L171)

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L159)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:189](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L189)

#### Returns

`void`

***

### publicChecked

> **publicChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L167)

***

### recurrence

> **recurrence**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:190](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L190)

***

### registerableChecked

> **registerableChecked**: `boolean`

Defined in: [src/types/Event/interface.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L169)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:187](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L187)

#### Returns

`Promise`\<`void`\>

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L166)

***

### setCustomRecurrenceModalIsOpen

> **setCustomRecurrenceModalIsOpen**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:193](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L193)

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L164)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L163)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L180)

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

Defined in: [src/types/Event/interface.ts:172](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L172)

***

### setPublicChecked

> **setPublicChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L168)

***

### setRecurrence

> **setRecurrence**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>\>

Defined in: [src/types/Event/interface.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L191)

***

### setRegisterableChecked

> **setRegisterableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L170)

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/Event/interface.ts:157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L157)

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L158)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L156)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L160)
