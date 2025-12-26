[Admin Docs](/)

***

# Function: formatRecurrenceForPayload()

> **formatRecurrenceForPayload**(`recurrenceRule`, `startDate`): `Omit`\<[`InterfaceRecurrenceRule`](../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/shared-components/EventForm/EventForm.tsx:519](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/EventForm/EventForm.tsx#L519)

Formats a recurrence rule for API submission.

## Parameters

### recurrenceRule

[`InterfaceRecurrenceRule`](../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

The recurrence rule to format

### startDate

`Date`

The event start date

## Returns

`Omit`\<[`InterfaceRecurrenceRule`](../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

The API-ready recurrence object (with endDate converted to ISO string if present) or null

## Throws

Error if the recurrence rule is invalid (contains validation error messages)
