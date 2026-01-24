[Admin Docs](/)

***

# Function: getAvailableUpdateOptions()

> **getAvailableUpdateOptions**(`payload`, `eventListCardProps`): `object`

Defined in: [src/components/EventListCard/Modal/updateLogic.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventListCard/Modal/updateLogic.ts#L80)

Computes which update scopes are available when editing a recurring event instance.

Determines whether the user can update just this instance, this and following instances,
or the entire series based on what fields have changed.

## Parameters

### payload

[`IEventFormSubmitPayload`](../../../../../types/EventForm/interface/interfaces/IEventFormSubmitPayload.md)

The form submission payload containing the new event data

### eventListCardProps

`IEventListCard`

The original event properties from the event list card

## Returns

`object`

An object with boolean fields:
  - `single`: `true` if updating only this instance is allowed (when recurrence hasn't changed)
  - `following`: `true` (always available for recurring instances)
  - `entireSeries`: `true` if only name or description changed (allows bulk metadata updates)

### entireSeries

> **entireSeries**: `boolean` = `onlyNameOrDescriptionChanged`

### following

> **following**: `boolean` = `true`

### single

> **single**: `boolean` = `!recurrenceChanged`

## Remarks

- The `entireSeries` option is only available when ONLY name/description changed
- Changes to start/end times, location, visibility, or recurrence prevent `entireSeries` updates
- The `single` option is disabled when the recurrence structure itself has changed
