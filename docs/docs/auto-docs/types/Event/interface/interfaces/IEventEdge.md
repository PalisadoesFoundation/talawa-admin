[Admin Docs](/)

***

# Interface: IEventEdge

Defined in: [src/types/Event/interface.ts:221](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L221)

## Properties

### cursor

> **cursor**: `string`

Defined in: [src/types/Event/interface.ts:263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L263)

***

### node

> **node**: `object`

Defined in: [src/types/Event/interface.ts:222](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L222)

#### allDay

> **allDay**: `boolean`

#### attendees?

> `optional` **attendees**: `object`[]

#### baseEvent?

> `optional` **baseEvent**: `object`

##### baseEvent.id

> **id**: `string`

##### baseEvent.name

> **name**: `string`

#### creator?

> `optional` **creator**: `object`

##### creator.id

> **id**: `string`

##### creator.name

> **name**: `string`

#### description?

> `optional` **description**: `string`

#### endAt

> **endAt**: `string`

#### hasExceptions?

> `optional` **hasExceptions**: `boolean`

#### id

> **id**: `string`

#### isInviteOnly

> **isInviteOnly**: `boolean`

Determines if the event is restricted to invited participants only.
When true, only invited users, the creator, and admins can see and access the event.

#### isPublic

> **isPublic**: `boolean`

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

#### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

#### isRegisterable

> **isRegisterable**: `boolean`

#### location?

> `optional` **location**: `string`

#### name

> **name**: `string`

#### progressLabel?

> `optional` **progressLabel**: `string`

#### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

#### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

#### sequenceNumber?

> `optional` **sequenceNumber**: `number`

#### startAt

> **startAt**: `string`

#### totalCount?

> `optional` **totalCount**: `number`
