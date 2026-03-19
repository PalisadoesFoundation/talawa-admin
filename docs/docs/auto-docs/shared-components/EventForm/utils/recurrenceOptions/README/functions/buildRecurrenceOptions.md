[Admin Docs](/)

***

# Function: buildRecurrenceOptions()

> **buildRecurrenceOptions**(`startDate`, `t`): [`InterfaceRecurrenceOption`](shared-components\EventForm\utils\recurrenceOptions\README\interfaces\InterfaceRecurrenceOption.md)[]

Defined in: [src/shared-components/EventForm/utils/recurrenceOptions.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/EventForm/utils/recurrenceOptions.ts#L26)

Builds an array of recurrence options based on the event start date.

## Parameters

### startDate

`Date`

The event start date

### t

(`key`, `options`?) => `string`

Translation function for option labels

## Returns

[`InterfaceRecurrenceOption`](shared-components\EventForm\utils\recurrenceOptions\README\interfaces\InterfaceRecurrenceOption.md)[]

Array of recurrence options for the dropdown
