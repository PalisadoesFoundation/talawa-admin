[Admin Docs](/)

***

# Interface: InterfaceEventUpdateInput

Defined in: [src/types/EventListCard/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L33)

Input payload for updating an event. Optional fields are included only when changed.

## Properties

### allDay?

> `optional` **allDay**: `boolean`

Defined in: [src/types/EventListCard/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L41)

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/EventListCard/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L36)

***

### endAt?

> `optional` **endAt**: `string`

Defined in: [src/types/EventListCard/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L43)

***

### id

> **id**: `string`

Defined in: [src/types/EventListCard/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L34)

***

### isInviteOnly?

> `optional` **isInviteOnly**: `boolean`

Defined in: [src/types/EventListCard/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L40)

***

### isPublic?

> `optional` **isPublic**: `boolean`

Defined in: [src/types/EventListCard/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L38)

***

### isRegisterable?

> `optional` **isRegisterable**: `boolean`

Defined in: [src/types/EventListCard/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L39)

***

### location?

> `optional` **location**: `string`

Defined in: [src/types/EventListCard/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L37)

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/EventListCard/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L35)

***

### recurrence?

> `optional` **recurrence**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/EventListCard/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L48)

Recurrence rule for the event.
This field is used for updating the recurrence pattern.

***

### startAt?

> `optional` **startAt**: `string`

Defined in: [src/types/EventListCard/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventListCard/interface.ts#L42)
