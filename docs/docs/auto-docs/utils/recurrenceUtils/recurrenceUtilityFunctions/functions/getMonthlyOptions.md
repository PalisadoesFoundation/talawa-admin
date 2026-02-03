[Admin Docs](/)

***

# Function: getMonthlyOptions()

> **getMonthlyOptions**(`startDate`): `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:384](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L384)

Generates monthly recurrence options based on the start date

## Parameters

### startDate

`Date`

The event start date

## Returns

`object`

Object containing monthly recurrence display strings and values

### byDate

> **byDate**: `string`

### byWeekday

> **byWeekday**: `string`

### dateValue

> **dateValue**: `number` = `dayOfMonth`

### weekdayValue

> **weekdayValue**: `object`

#### weekdayValue.day

> **day**: [`WeekDays`](../../recurrenceTypes/enumerations/WeekDays.md)

#### weekdayValue.week

> **week**: `number` = `weekdayOccurrence`
