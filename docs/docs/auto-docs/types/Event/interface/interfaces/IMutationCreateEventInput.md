[Admin Docs](/)

***

# Interface: IMutationCreateEventInput

Defined in: [src/types/Event/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L318)

Input shape accepted by `MutationCreateEventInput` in GraphQL.

It supports either timed (`startAt`/`endAt`) or all-day (`startDate`/`endDate`)
payloads depending on the `allDay` flag.

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L325)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:333](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L333)

***

### endAt?

> `optional` **endAt**: `string`

Defined in: [src/types/Event/interface.ts:321](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L321)

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/Event/interface.ts:323](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L323)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:332](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L332)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:330](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L330)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:331](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L331)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:334](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L334)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L319)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L324)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:335](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L335)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt?

> `optional` **startAt**: `string`

Defined in: [src/types/Event/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L320)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/Event/interface.ts:322](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L322)
