[Admin Docs](/)

***

# Interface: IEventFormInput

Defined in: [src/types/Event/interface.ts:282](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L282)

UI/form-friendly input for event creation.

This model may contain date-only fields (`startDate`, `endDate`) for all-day
workflows and is intentionally mapped to GraphQL's strict mutation input via
`mapCreateEventInputToMutationInput` before calling `CreateEvent`.

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:289](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L289)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:297](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L297)

***

### endAt?

> `optional` **endAt**: `string`

Defined in: [src/types/Event/interface.ts:285](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L285)

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/Event/interface.ts:287](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L287)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:296](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L296)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:294](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L294)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:295](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L295)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:298](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L298)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:283](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L283)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:288](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L288)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:299](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L299)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt?

> `optional` **startAt**: `string`

Defined in: [src/types/Event/interface.ts:284](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L284)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/Event/interface.ts:286](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L286)
