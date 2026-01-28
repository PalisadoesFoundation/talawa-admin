[**talawa-admin**](../../../../README.md)

***

# Function: formatRecurrenceForPayload()

> **formatRecurrenceForPayload**(`recurrenceRule`, `startDate`): `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/shared-components/EventForm/EventForm.tsx:563](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/shared-components/EventForm/EventForm.tsx#L563)

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
