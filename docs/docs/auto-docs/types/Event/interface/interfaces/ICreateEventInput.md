[Admin Docs](/)

***

# Interface: ICreateEventInput

Defined in: [src/types/Event/interface.ts:247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L247)

Input interface for creating events via CREATE_EVENT_MUTATION.
Used by both Admin Portal (CreateEventModal) and User Portal (Events).

Note: The recurrence property type matches the return type of
formatRecurrenceForPayload from EventForm.tsx

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:252](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L252)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:256](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L256)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:250](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L250)

***

### isInviteOnly?

> `optional` **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L255)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:253](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L253)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:254](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L254)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:257](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L257)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:248](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L248)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:251](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L251)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:258](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L258)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:249](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L249)
