[**talawa-admin**](../../../../README.md)

***

# Function: formatRecurrenceForApi()

> **formatRecurrenceForApi**(`recurrence`): `Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:304](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L304)

Formats a recurrence rule for API submission.
Converts Date object to ISO string for `endDate`.

## Parameters

### recurrence

[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

The recurrence rule to format.

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

A recurrence rule object suitable for API submission.
