[**talawa-admin**](../../../../README.md)

***

# Function: formatRecurrenceForApi()

> **formatRecurrenceForApi**(`recurrence`): `Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:304](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L304)

Formats a recurrence rule for API submission.
Converts Date object to ISO string for `endDate`.

## Parameters

### recurrence

[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

The recurrence rule to format.

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](../../recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

A recurrence rule object suitable for API submission.
