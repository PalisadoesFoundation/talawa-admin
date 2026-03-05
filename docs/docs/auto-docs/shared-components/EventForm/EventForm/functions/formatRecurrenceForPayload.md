[Admin Docs](/)

***

# Function: formatRecurrenceForPayload()

> **formatRecurrenceForPayload**(`recurrenceRule`, `startDate`): `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/shared-components/EventForm/EventForm.tsx:554](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/EventForm/EventForm.tsx#L554)

Formats a recurrence rule for API submission.

## Parameters

### recurrenceRule

[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

The recurrence rule to format

### startDate

`Date`

The event start date

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

The formatted recurrence string or null

## Throws

Error if the recurrence rule is invalid
