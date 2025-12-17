[Admin Docs](/)

***

# Interface: IPreviewEventModalProps

Defined in: src/types/Event/interface.ts:134

## Properties

### alldaychecked

> **alldaychecked**: `boolean`

Defined in: src/types/Event/interface.ts:147

***

### customRecurrenceModalIsOpen

> **customRecurrenceModalIsOpen**: `boolean`

Defined in: src/types/Event/interface.ts:172

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: src/types/Event/interface.ts:144

***

### eventListCardProps

> **eventListCardProps**: `IEventListCard`

Defined in: src/types/Event/interface.ts:135

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: src/types/Event/interface.ts:136

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: src/types/Event/interface.ts:143

***

### formState

> **formState**: `object`

Defined in: src/types/Event/interface.ts:153

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

Defined in: src/types/Event/interface.ts:168

#### Returns

`Promise`\<`void`\>

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: src/types/Event/interface.ts:137

#### Returns

`void`

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: src/types/Event/interface.ts:141

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: src/types/Event/interface.ts:169

#### Returns

`void`

***

### publicchecked

> **publicchecked**: `boolean`

Defined in: src/types/Event/interface.ts:149

***

### recurrence

> **recurrence**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: src/types/Event/interface.ts:170

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: src/types/Event/interface.ts:167

#### Returns

`Promise`\<`void`\>

***

### registrablechecked

> **registrablechecked**: `boolean`

Defined in: src/types/Event/interface.ts:151

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: src/types/Event/interface.ts:148

***

### setCustomRecurrenceModalIsOpen

> **setCustomRecurrenceModalIsOpen**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: src/types/Event/interface.ts:173

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: src/types/Event/interface.ts:146

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: src/types/Event/interface.ts:145

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: src/types/Event/interface.ts:160

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

Defined in: src/types/Event/interface.ts:150

***

### setRecurrence

> **setRecurrence**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)\>\>

Defined in: src/types/Event/interface.ts:171

***

### setRegistrableChecked

> **setRegistrableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: src/types/Event/interface.ts:152

***

### t()

> **t**: (`key`) => `string`

Defined in: src/types/Event/interface.ts:139

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: src/types/Event/interface.ts:140

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: src/types/Event/interface.ts:138

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: src/types/Event/interface.ts:142
