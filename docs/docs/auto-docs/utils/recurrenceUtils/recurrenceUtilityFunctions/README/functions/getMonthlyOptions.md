[**talawa-admin**](README.md)

***

# Function: getMonthlyOptions()

> **getMonthlyOptions**(`startDate`): `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:354](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L354)

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

> **day**: [`WeekDays`](utils\recurrenceUtils\recurrenceTypes\README\enumerations\WeekDays.md)

#### weekdayValue.week

> **week**: `number` = `weekOfMonth`
