[Admin Docs](/)

***

# Interface: ICreateEventInput

Defined in: [src/types/Event/interface.ts:279](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L279)

Input interface for creating events via CREATE_EVENT_MUTATION.
Used by both Admin Portal (CreateEventModal) and User Portal (Events).

Note: The recurrence property type matches the return type of
formatRecurrenceForPayload from EventForm.tsx

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:282](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L282)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:296](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L296)

***

### endAt?

> `optional` **endAt**: `string`

Defined in: [src/types/Event/interface.ts:292](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L292)

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/Event/interface.ts:295](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L295)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:289](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L289)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:287](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L287)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:288](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L288)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:297](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L297)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:280](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L280)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:281](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L281)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:298](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L298)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt?

> `optional` **startAt**: `string`

Defined in: [src/types/Event/interface.ts:291](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L291)

Timed events (allDay=false): full ISO datetime strings

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/Event/interface.ts:294](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L294)

All-day events (allDay=true): date-only strings (YYYY-MM-DD)
