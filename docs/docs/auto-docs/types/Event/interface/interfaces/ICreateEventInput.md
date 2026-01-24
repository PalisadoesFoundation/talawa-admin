[Admin Docs](/)

***

# Interface: ICreateEventInput

Defined in: [src/types/Event/interface.ts:244](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L244)

Input interface for creating events via CREATE_EVENT_MUTATION.
Used by both Admin Portal (CreateEventModal) and User Portal (Events).

Note: The recurrence property type matches the return type of
formatRecurrenceForPayload from EventForm.tsx

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:249](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L249)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:257](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L257)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L247)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:256](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L256)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:254](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L254)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L255)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:258](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L258)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:245](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L245)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:248](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L248)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:259](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L259)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:246](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L246)
