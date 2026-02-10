[Admin Docs](/)

***

# Interface: ICreateEventInput

Defined in: [src/types/Event/interface.ts:266](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L266)

Input interface for creating events via CREATE_EVENT_MUTATION.
Used by both Admin Portal (CreateEventModal) and User Portal (Events).

Note: The recurrence property type matches the return type of
formatRecurrenceForPayload from EventForm.tsx

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:271](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L271)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:279](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L279)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:269](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L269)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:278](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L278)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:276](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L276)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:277](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L277)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:280](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L280)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:267](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L267)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:270](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L270)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:281](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L281)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:268](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L268)
