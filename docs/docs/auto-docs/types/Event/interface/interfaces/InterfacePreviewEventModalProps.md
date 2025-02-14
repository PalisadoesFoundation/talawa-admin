[Admin Docs](/)

***

# Interface: InterfacePreviewEventModalProps

Defined in: [src/types/Event/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L131)

## Properties

### alldaychecked

> **alldaychecked**: `boolean`

Defined in: [src/types/Event/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L146)

***

### eventEndDate

> **eventEndDate**: `Date`

Defined in: [src/types/Event/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L143)

***

### eventListCardProps

> **eventListCardProps**: `InterfaceEventListCard`

Defined in: [src/types/Event/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L132)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/Event/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L133)

***

### eventStartDate

> **eventStartDate**: `Date`

Defined in: [src/types/Event/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L142)

***

### formState

> **formState**: `object`

Defined in: [src/types/Event/interface.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L159)

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

Defined in: [src/types/Event/interface.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L174)

#### Returns

`Promise`\<`void`\>

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/Event/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L134)

#### Returns

`void`

***

### isRegistered?

> `optional` **isRegistered**: `boolean`

Defined in: [src/types/Event/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L140)

***

### openEventDashboard()

> **openEventDashboard**: () => `void`

Defined in: [src/types/Event/interface.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L175)

#### Returns

`void`

***

### popover

> **popover**: `Element`

Defined in: [src/types/Event/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L139)

***

### publicchecked

> **publicchecked**: `boolean`

Defined in: [src/types/Event/interface.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L150)

***

### recurrenceRuleState

> **recurrenceRuleState**: [`InterfaceRecurrenceRuleState`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRuleState.md)

Defined in: [src/types/Event/interface.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L154)

***

### recurrenceRuleText

> **recurrenceRuleText**: `string`

Defined in: [src/types/Event/interface.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L158)

***

### recurringchecked

> **recurringchecked**: `boolean`

Defined in: [src/types/Event/interface.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L148)

***

### registerEventHandler()

> **registerEventHandler**: () => `Promise`\<`void`\>

Defined in: [src/types/Event/interface.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L173)

#### Returns

`Promise`\<`void`\>

***

### registrablechecked

> **registrablechecked**: `boolean`

Defined in: [src/types/Event/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L152)

***

### setAllDayChecked

> **setAllDayChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L147)

***

### setEventEndDate

> **setEventEndDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L145)

***

### setEventStartDate

> **setEventStartDate**: `Dispatch`\<`SetStateAction`\<`Date`\>\>

Defined in: [src/types/Event/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L144)

***

### setFormState()

> **setFormState**: (`state`) => `void`

Defined in: [src/types/Event/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L166)

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

Defined in: [src/types/Event/interface.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L151)

***

### setRecurrenceRuleState

> **setRecurrenceRuleState**: `Dispatch`\<`SetStateAction`\<[`InterfaceRecurrenceRuleState`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRuleState.md)\>\>

Defined in: [src/types/Event/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L155)

***

### setRecurringChecked

> **setRecurringChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L149)

***

### setRegistrableChecked

> **setRegistrableChecked**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/Event/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L153)

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L136)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/Event/interface.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L137)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/Event/interface.ts:135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L135)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/Event/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L141)

***

### weekDayOccurenceInMonth?

> `optional` **weekDayOccurenceInMonth**: `number`

Defined in: [src/types/Event/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L138)
