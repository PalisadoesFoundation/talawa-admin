[Admin Docs](/)

***

# Interface: IPreviewEventModalProps

Defined in: [src/types/Event/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L142)

## Properties

### alldaychecked

> **alldaychecked**: `boolean`

Defined in: [src/types/Event/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L155)

***

### customRecurrenceModalIsOpen

> **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L180)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L152)

***

### eventListCardProps

> **eventListCardProps**: `IEventListCard`

Defined in: [src/types/Event/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L143)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L144)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L151)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L161)

#### endTime

> **endTime**: `string`

#### eventdescrip

> **eventdescrip**: `string`

#### location

> **location**: `string`

#### name

> **name**: `string`

#### startTime

> **startTime**: `string`

***

### handleEventUpdate()

> **handleEventUpdate**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L176)

#### Returns

`Promise`\<`void`\>

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L145)

#### Returns

`void`

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L149)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L177)

#### Returns

`void`

***

### publicchecked

> **publicchecked**: `boolean`

Defined in: [src/types/Event/interface.ts:157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L157)

***

### recurrence

> **recurrence**: [`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L178)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L175)

#### Returns

`Promise`\<`void`\>

***

### registrablechecked

> **registrablechecked**: `boolean`

Defined in: [src/types/Event/interface.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L159)

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L156)

***

### setCustomRecurrenceModalIsOpen

> **setCustomRecurrenceModalIsOpen**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:181](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L181)

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L154)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L153)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L168)

#### Parameters

##### state

###### endTime

`string`

###### eventdescrip

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

### setPublicChecked

> **setPublicChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L158)

***

### setRecurrence

> **setRecurrence**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md)\>\>

Defined in: [src/types/Event/interface.ts:179](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L179)

***

### setRegistrableChecked

> **setRegistrableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L160)

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L147)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L148)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L146)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L150)
