[Admin Docs](/)

***

# Interface: InterfaceRecurrenceWeeklySectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L63)

## Properties

### byDay?

> `optional` **byDay**: [`WeekDays`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/WeekDays.md)[]

Defined in: [src/types/shared-components/Recurrence/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L65)

***

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L64)

***

### onDayClick()

> **onDayClick**: (`day`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L66)

#### Parameters

##### day

[`WeekDays`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/WeekDays.md)

#### Returns

`void`

***

### onWeekdayKeyDown()

> **onWeekdayKeyDown**: (`e`, `currentIndex`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L67)

#### Parameters

##### e

`KeyboardEvent`\<`HTMLButtonElement`\>

##### currentIndex

`number`

#### Returns

`void`
