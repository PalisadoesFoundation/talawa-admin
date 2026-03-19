[Admin Docs](/)

***

# Interface: IMutationCreateEventInput

Defined in: [src/types/Event/interface.ts:313](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L313)

Input shape accepted by `MutationCreateEventInput` in GraphQL.

It supports either timed (`startAt`/`endAt`) or all-day (`startDate`/`endDate`)
payloads depending on the `allDay` flag.

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L320)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Event/interface.ts:328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L328)

***

### endAt?

> `optional` **endAt**: `string`

Defined in: [src/types/Event/interface.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L316)

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/Event/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L318)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:327](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L327)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L325)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L326)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/Event/interface.ts:329](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L329)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L314)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/Event/interface.ts:319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L319)

***

### recurrence?

> `optional` **recurrence**: `Omit`\<[`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md), `"endDate"`\> & `object`

Defined in: [src/types/Event/interface.ts:330](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L330)

#### Type Declaration

##### endDate?

> `optional` **endDate**: `string`

***

### startAt?

> `optional` **startAt**: `string`

Defined in: [src/types/Event/interface.ts:315](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L315)

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/Event/interface.ts:317](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L317)
