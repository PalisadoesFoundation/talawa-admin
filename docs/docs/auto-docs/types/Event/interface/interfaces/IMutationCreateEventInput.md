[Admin Docs](/)

***

# Interface: IMutationCreateEventInput

Defined in: [src/types/Event/interface.ts:307](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L307)

Strict input shape accepted by `MutationCreateEventInput` in GraphQL.

Unlike `ICreateEventInput` (UI/form-friendly), this contract requires
concrete `startAt` and `endAt` timestamps and does not allow date-only fields.

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:312](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L312)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L320)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:310](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L310)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L319)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:317](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L317)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L318)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:321](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L321)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:308](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L308)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:311](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L311)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:322](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L322)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:309](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L309)
