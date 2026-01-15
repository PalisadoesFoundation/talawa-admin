[**talawa-admin**](../../../../README.md)

***

# Function: formatRecurrenceForApi()

> **formatRecurrenceForApi**(`recurrence`): `Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:304](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L304)

Formats a recurrence rule for API submission.
Converts Date object to ISO string for `endDate`.

## Parameters

### recurrence

[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

The recurrence rule to format.

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

A recurrence rule object suitable for API submission.
