[Admin Docs](/)

***

# Interface: IPreviewEventModalProps

Defined in: [src/types/Event/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L130)

## Properties

### alldaychecked

> **alldaychecked**: `boolean`

Defined in: [src/types/Event/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L143)

***

### customRecurrenceModalIsOpen

> **customRecurrenceModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L168)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L140)

***

### eventListCardProps

> **eventListCardProps**: [`IEventListCard`](IEventListCard.md)

Defined in: [src/types/Event/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L131)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L132)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L139)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L149)

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

Defined in: [src/types/Event/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L164)

#### Returns

`Promise`\<`void`\>

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L133)

#### Returns

`void`

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L137)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L165)

#### Returns

`void`

***

### publicchecked

> **publicchecked**: `boolean`

Defined in: [src/types/Event/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L145)

***

### recurrence

> **recurrence**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L166)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L163)

#### Returns

`Promise`\<`void`\>

***

### registrablechecked

> **registrablechecked**: `boolean`

Defined in: [src/types/Event/interface.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L147)

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L144)

***

### setCustomRecurrenceModalIsOpen

> **setCustomRecurrenceModalIsOpen**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L169)

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L142)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L141)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L156)

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

Defined in: [src/types/Event/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L146)

***

### setRecurrence

> **setRecurrence**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>\>

Defined in: [src/types/Event/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L167)

***

### setRegistrableChecked

> **setRegistrableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L148)

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L135)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L136)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L134)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L138)
