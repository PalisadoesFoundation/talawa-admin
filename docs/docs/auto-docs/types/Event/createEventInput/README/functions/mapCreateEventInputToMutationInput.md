[Admin Docs](/)

***

# Function: mapCreateEventInputToMutationInput()

> **mapCreateEventInputToMutationInput**(`input`): [`IMutationCreateEventInput`](types\Event\interface\README\interfaces\IMutationCreateEventInput.md)

Defined in: [src/types/Event/createEventInput.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/createEventInput.ts#L20)

Maps flexible UI/form create-event input to GraphQL mutation input.

Contract:
- All-day events must use `startDate` + `endDate`.
- Timed events must use `startAt` + `endAt`.

## Parameters

### input

[`IEventFormInput`](types\Event\interface\README\interfaces\IEventFormInput.md)

## Returns

[`IMutationCreateEventInput`](types\Event\interface\README\interfaces\IMutationCreateEventInput.md)
