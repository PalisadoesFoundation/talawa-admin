[Admin Docs](/)

***

# Interface: ICreateEventInput

Defined in: [src/types/Event/interface.ts:267](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L267)

Input interface for creating events via CREATE_EVENT_MUTATION.
Used by both Admin Portal (CreateEventModal) and User Portal (Events).

Note: The recurrence property type matches the return type of
formatRecurrenceForPayload from EventForm.tsx

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:272](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L272)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:280](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L280)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:270](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L270)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:279](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L279)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:277](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L277)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:278](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L278)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:281](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L281)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:268](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L268)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:271](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L271)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:282](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L282)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:269](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L269)
