[Admin Docs](/)

***

# Interface: InterfacePreviewEventModalProps

Defined in: [src/types/Event/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L77)

## Properties

### alldaychecked

> **alldaychecked**: `boolean`

Defined in: [src/types/Event/interface.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L92)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L89)

***

### eventListCardProps

> **eventListCardProps**: `InterfaceEventListCard`

Defined in: [src/types/Event/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L78)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L79)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L88)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L105)

#### endTime

> **endTime**: `string`

#### eventdescrip

> **eventdescrip**: `string`

#### location

> **location**: `string`

#### startTime

> **startTime**: `string`

#### title

> **title**: `string`

***

### handleEventUpdate()

> **handleEventUpdate**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L120)

#### Returns

`Promise`\<`void`\>

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L80)

#### Returns

`void`

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L86)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L121)

#### Returns

`void`

***

### popover

> **popover**: `Element`

Defined in: [src/types/Event/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L85)

***

### publicchecked

> **publicchecked**: `boolean`

Defined in: [src/types/Event/interface.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L96)

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRuleState`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRuleState.md)

Defined in: [src/types/Event/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L100)

***

### recurrenceRuleText

> **recurrenceRuleText**: `string`

Defined in: [src/types/Event/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L104)

***

### recurringchecked

> **recurringchecked**: `boolean`

Defined in: [src/types/Event/interface.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L94)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L119)

#### Returns

`Promise`\<`void`\>

***

### registrablechecked

> **registrablechecked**: `boolean`

Defined in: [src/types/Event/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L98)

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L93)

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L91)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L90)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L112)

#### Parameters

##### state

###### endTime

`string`

###### eventdescrip

`string`

###### location

`string`

###### startTime

`string`

###### title

`string`

#### Returns

`void`

***

### setPublicChecked

> **setPublicChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L97)

***

### setRecurrenceRuleState

> **setRecurrenceRuleState**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRuleState`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRuleState.md)\>\>

Defined in: [src/types/Event/interface.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L101)

***

### setRecurringChecked

> **setRecurringChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L95)

***

### setRegistrableChecked

> **setRegistrableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L99)

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L82)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L83)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L81)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L87)

***

### weekDayOccurenceInMonth?

> `optional` **weekDayOccurenceInMonth**: `number`

Defined in: [src/types/Event/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L84)
