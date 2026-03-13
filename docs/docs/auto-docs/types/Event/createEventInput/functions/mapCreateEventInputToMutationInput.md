[Admin Docs](/)

***

# Function: mapCreateEventInputToMutationInput()

> **mapCreateEventInputToMutationInput**(`input`): [`IMutationCreateEventInput`](../../interface/interfaces/IMutationCreateEventInput.md)

Defined in: [src/types/Event/createEventInput.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/createEventInput.ts#L25)

Maps flexible UI/form create-event input to GraphQL's strict mutation input.

Accepted input forms:
- Timed/all-day timestamp payload: `startAt` + `endAt`
- Legacy date-only payload: `startDate` (+ optional `endDate`)

For date-only payloads, `endDate` is treated as an exclusive date when present.

## Parameters

### input

[`IEventFormInput`](../../interface/interfaces/IEventFormInput.md)

## Returns

[`IMutationCreateEventInput`](../../interface/interfaces/IMutationCreateEventInput.md)
