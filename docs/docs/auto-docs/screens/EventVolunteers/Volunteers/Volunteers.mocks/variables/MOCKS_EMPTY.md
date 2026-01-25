[**talawa-admin**](../../../../../README.md)

***

# Variable: MOCKS\_EMPTY

> `const` **MOCKS\_EMPTY**: `object`[]

Defined in: [src/screens/EventVolunteers/Volunteers/Volunteers.mocks.ts:414](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/screens/EventVolunteers/Volunteers/Volunteers.mocks.ts#L414)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `GET_EVENT_VOLUNTEERS`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'eventId'`

#### request.variables.orderBy

> **orderBy**: `any` = `undefined`

#### request.variables.where

> **where**: `object`

#### request.variables.where.eventId

> **eventId**: `string` = `'eventId'`

#### request.variables.where.hasAccepted

> **hasAccepted**: `any` = `undefined`

#### request.variables.where.name\_contains

> **name\_contains**: `string` = `''`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.event

> **event**: `object`

#### result.data.event.baseEvent

> **baseEvent**: `any` = `null`

#### result.data.event.id

> **id**: `string` = `'eventId'`

#### result.data.event.recurrenceRule

> **recurrenceRule**: `any` = `null`

#### result.data.event.volunteers

> **volunteers**: [`InterfaceEventVolunteerInfo`](../../../../../types/Volunteer/interface/interfaces/InterfaceEventVolunteerInfo.md)[]
