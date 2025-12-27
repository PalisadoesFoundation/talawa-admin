[**talawa-admin**](README.md)

***

# Function: formatRecurrenceForApi()

> **formatRecurrenceForApi**(`recurrence`): `Omit`\<[`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts:304](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/recurrenceUtils/recurrenceUtilityFunctions.ts#L304)

Formats a recurrence rule for API submission.
Converts Date object to ISO string for `endDate`.

## Parameters

### recurrence

[`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md)

The recurrence rule to format.

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

A recurrence rule object suitable for API submission.
