[Admin Docs](/)

***

# Function: buildRecurrenceOptions()

> **buildRecurrenceOptions**(`startDate`, `t`): [`RecurrenceOption`](../interfaces/RecurrenceOption.md)[]

Defined in: [src/shared-components/EventForm/utils/recurrenceOptions.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/EventForm/utils/recurrenceOptions.ts#L25)

Builds an array of recurrence options based on the event start date.

## Parameters

### startDate

`Date`

The event start date

### t

(`key`, `options?`) => `string`

Translation function for option labels

## Returns

[`RecurrenceOption`](../interfaces/RecurrenceOption.md)[]

Array of recurrence options for the dropdown
