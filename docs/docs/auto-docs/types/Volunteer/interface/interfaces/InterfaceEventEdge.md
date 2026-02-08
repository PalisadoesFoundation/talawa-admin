[Admin Docs](/)

***

# Interface: InterfaceEventEdge

Defined in: [src/types/Volunteer/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L45)

Defines the structure for GraphQL event edge from queries.

## Param

The event node containing all event data.

## Properties

### node

> **node**: `object`

Defined in: [src/types/Volunteer/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L46)

#### allDay

> **allDay**: `boolean`

#### baseEvent?

> `optional` **baseEvent**: `object`

##### baseEvent.id

> **id**: `string`

##### baseEvent.isRecurringEventTemplate

> **isRecurringEventTemplate**: `boolean`

##### baseEvent.name

> **name**: `string`

#### description

> **description**: `string`

#### endAt

> **endAt**: `string`

#### id

> **id**: `string`

#### isRecurringEventTemplate

> **isRecurringEventTemplate**: `boolean`

#### location

> **location**: `string`

#### name

> **name**: `string`

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.frequency

> **frequency**: `string`

##### recurrenceRule.id

> **id**: `string`

#### startAt

> **startAt**: `string`

#### volunteerGroups

> **volunteerGroups**: `object`[]

#### volunteers

> **volunteers**: `object`[]
