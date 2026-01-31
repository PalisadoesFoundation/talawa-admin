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

Defined in: [src/types/Event/interface.ts:278](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L278)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:286](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L286)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:276](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L276)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:285](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L285)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:283](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L283)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:284](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L284)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:287](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L287)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:274](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L274)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:277](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L277)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:288](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L288)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:275](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L275)
