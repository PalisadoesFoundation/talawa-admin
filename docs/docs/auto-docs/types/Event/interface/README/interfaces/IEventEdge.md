[**talawa-admin**](README.md)

***

# Interface: IEventEdge

Defined in: [src/types/Event/interface.ts:204](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L204)

## Properties

### cursor

> **cursor**: `string`

Defined in: [src/types/Event/interface.ts:233](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L233)

***

### node

> **node**: `object`

Defined in: [src/types/Event/interface.ts:205](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/types/Event/interface.ts#L205)

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

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md)

#### sequenceNumber?

> `optional` **sequenceNumber**: `number`

#### startAt

> **startAt**: `string`

#### totalCount?

> `optional` **totalCount**: `number`
