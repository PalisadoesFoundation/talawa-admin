[**talawa-admin**](../../../../README.md)

***

# Function: formatRecurrenceForPayload()

> **formatRecurrenceForPayload**(`recurrenceRule`, `startDate`): `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/shared-components/EventForm/EventForm.tsx:563](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/EventForm/EventForm.tsx#L563)

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
