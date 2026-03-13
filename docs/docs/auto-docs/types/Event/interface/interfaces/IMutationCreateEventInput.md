[Admin Docs](/)

***

# Interface: IMutationCreateEventInput

Defined in: [src/types/Event/interface.ts:313](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L313)

Strict input shape accepted by `MutationCreateEventInput` in GraphQL.

Unlike `ICreateEventInput` (UI/form-friendly), this contract requires
concrete `startAt` and `endAt` timestamps and does not allow date-only fields.

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L318)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L326)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L316)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L325)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:323](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L323)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L324)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:327](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L327)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L314)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:317](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L317)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L328)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:315](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L315)
