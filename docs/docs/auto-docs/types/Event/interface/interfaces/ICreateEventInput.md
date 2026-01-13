[Admin Docs](/)

***

# Interface: ICreateEventInput

Defined in: [src/types/Event/interface.ts:259](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L259)

Input interface for creating events via CREATE_EVENT_MUTATION.
Used by both Admin Portal (CreateEventModal) and User Portal (Events).

Note: The recurrence property type matches the return type of
formatRecurrenceForPayload from EventForm.tsx

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:264](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L264)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:272](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L272)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:262](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L262)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:271](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L271)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:269](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L269)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:270](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L270)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L273)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:260](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L260)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L263)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:274](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L274)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:261](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L261)
