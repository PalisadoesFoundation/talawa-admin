[Admin Docs](/)

***

# Function: hasRecurrenceChanged()

> **hasRecurrenceChanged**(`payload`, `eventListCardProps`): `boolean`

Defined in: [src/components/EventListCard/Modal/updateLogic.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventListCard/Modal/updateLogic.ts#L34)

Determines if the recurrence rule has changed between the submitted payload and the original event.

Compares recurrence presence, frequency, interval, day/month patterns, count, and end date
to detect any modifications to the recurrence configuration.

## Parameters

### payload

[`IEventFormSubmitPayload`](../../../../../types/EventForm/interface/interfaces/IEventFormSubmitPayload.md)

The form submission payload containing the new event data

### eventListCardProps

`IEventListCard`

The original event properties from the event list card

## Returns

`boolean`

`true` if any recurrence property has changed, `false` otherwise
