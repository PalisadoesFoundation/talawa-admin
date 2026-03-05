[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceEventEdge

Defined in: [src/types/Volunteer/interface.ts:44](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/Volunteer/interface.ts#L44)

Defines the structure for GraphQL event edge from queries.

## Properties

### node

> **node**: `object`

Defined in: [src/types/Volunteer/interface.ts:46](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/Volunteer/interface.ts#L46)

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
