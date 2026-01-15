[**talawa-admin**](../../../../README.md)

***

# Function: getMonthlyOptions()

> **getMonthlyOptions**(`startDate`): `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:354](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L354)

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

> **week**: `number` = `weekOfMonth`
