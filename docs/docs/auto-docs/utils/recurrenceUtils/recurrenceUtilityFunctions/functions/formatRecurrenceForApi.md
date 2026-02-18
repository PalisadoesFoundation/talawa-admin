[Admin Docs](/)

***

# Function: formatRecurrenceForApi()

> **formatRecurrenceForApi**(`recurrence`): `Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:303](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L303)

Formats a recurrence rule for API submission.
Converts Date object to ISO string for `endDate`.

## Parameters

### recurrence

[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

The recurrence rule to format.

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

A recurrence rule object suitable for API submission.
