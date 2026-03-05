[Admin Docs](/)

***

# Interface: InterfaceRecurrenceWeeklySectionProps

Defined in: [src/types/shared-components/Recurrence/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L71)

## Properties

### byDay?

> `optional` **byDay**: [`WeekDays`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/WeekDays.md)[]

Defined in: [src/types/shared-components/Recurrence/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L73)

***

### frequency

> **frequency**: [`Frequency`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/Frequency.md)

Defined in: [src/types/shared-components/Recurrence/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L72)

***

### onDayClick()

> **onDayClick**: (`day`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L74)

#### Parameters

##### day

[`WeekDays`](../../../../../utils/recurrenceUtils/recurrenceTypes/enumerations/WeekDays.md)

#### Returns

`void`

***

### onWeekdayKeyDown()

> **onWeekdayKeyDown**: (`e`, `currentIndex`) => `void`

Defined in: [src/types/shared-components/Recurrence/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Recurrence/interface.ts#L75)

#### Parameters

##### e

`KeyboardEvent`\<`HTMLButtonElement`\>

##### currentIndex

`number`

#### Returns

`void`
