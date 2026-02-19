[Admin Docs](/)

***

# Interface: InterfaceRecurrenceWeeklySectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L67)

## Properties

### byDay?

> `optional` **byDay**: [`WeekDays`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/WeekDays.md)[]

Defined in: [src/types/shared-components/Recurrence/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L69)

***

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L68)

***

### onDayClick()

> **onDayClick**: (`day`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L70)

#### Parameters

##### day

[`WeekDays`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/WeekDays.md)

#### Returns

`void`

***

### onWeekdayKeyDown()

> **onWeekdayKeyDown**: (`e`, `currentIndex`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L71)

#### Parameters

##### e

`KeyboardEvent`\<`HTMLButtonElement`\>

##### currentIndex

`number`

#### Returns

`void`

***

### t()

> **t**: (`key`) => `string`

Defined in: [src/types/shared-components/Recurrence/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L75)

#### Parameters

##### key

`string`

#### Returns

`string`
