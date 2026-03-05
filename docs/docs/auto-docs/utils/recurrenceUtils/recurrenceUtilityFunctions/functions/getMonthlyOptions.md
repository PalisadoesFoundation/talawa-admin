[**talawa-admin**](../../../../README.md)

***

# Function: getMonthlyOptions()

> **getMonthlyOptions**(`startDate`): `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:386](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L386)

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
