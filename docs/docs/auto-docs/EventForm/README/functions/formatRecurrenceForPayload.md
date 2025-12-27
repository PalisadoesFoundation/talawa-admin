[**talawa-admin**](README.md)

***

# Function: formatRecurrenceForPayload()

> **formatRecurrenceForPayload**(`recurrenceRule`, `startDate`): `Omit`\<[`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/shared-components/EventForm/EventForm.tsx:617](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/shared-components/EventForm/EventForm.tsx#L617)

Formats a recurrence rule for API submission.

## Parameters

### recurrenceRule

[`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md)

The recurrence rule to format

### startDate

`Date`

The event start date

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

The formatted recurrence string or null

## Throws

Error if the recurrence rule is invalid
