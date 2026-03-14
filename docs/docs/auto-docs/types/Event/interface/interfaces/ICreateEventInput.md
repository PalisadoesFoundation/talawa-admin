[Admin Docs](/)

***

# Interface: ICreateEventInput

Defined in: [src/types/Event/interface.ts:273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L273)

Input interface for creating events via CREATE_EVENT_MUTATION.
Used by both Admin Portal (CreateEventModal) and User Portal (Events).

Note: The recurrence property type matches the return type of
formatRecurrenceForPayload from EventForm.tsx

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:284](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L284)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:292](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L292)

***

### endAt?

> `optional` **endAt**: `string`

Defined in: [src/types/Event/interface.ts:278](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L278)

ISO DateTime string — required when allDay is false, must NOT be sent when allDay is true

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/Event/interface.ts:282](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L282)

YYYY-MM-DD date string — required when allDay is true, must NOT be sent when allDay is false

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:291](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L291)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:289](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L289)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:290](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L290)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:293](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L293)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:274](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L274)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:283](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L283)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:294](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L294)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt?

> `optional` **startAt**: `string`

Defined in: [src/types/Event/interface.ts:276](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L276)

ISO DateTime string — required when allDay is false, must NOT be sent when allDay is true

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/Event/interface.ts:280](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L280)

YYYY-MM-DD date string — required when allDay is true, must NOT be sent when allDay is false
