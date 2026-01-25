[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceEventEdge

Defined in: [src/types/Volunteer/interface.ts:48](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/Volunteer/interface.ts#L48)

InterfaceEventEdge

## Description

Defines the structure for GraphQL event edge from queries.

## Properties

### node

> **node**: `object`

Defined in: [src/types/Volunteer/interface.ts:49](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/Volunteer/interface.ts#L49)

The event node containing all event data.

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
