[Admin Docs](/)

***

# Interface: IEventEdge

Defined in: [src/types/Event/interface.ts:208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L208)

## Properties

### cursor

> **cursor**: `string`

Defined in: [src/types/Event/interface.ts:241](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L241)

***

### node

> **node**: `object`

Defined in: [src/types/Event/interface.ts:209](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L209)

#### allDay

> **allDay**: `boolean`

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
