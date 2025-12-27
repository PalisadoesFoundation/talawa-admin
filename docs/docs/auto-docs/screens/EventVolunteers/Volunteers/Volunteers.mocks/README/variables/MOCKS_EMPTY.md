[**talawa-admin**](README.md)

***

# Variable: MOCKS\_EMPTY

> `const` **MOCKS\_EMPTY**: `object`[]

Defined in: [src/screens/EventVolunteers/Volunteers/Volunteers.mocks.ts:394](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/screens/EventVolunteers/Volunteers/Volunteers.mocks.ts#L394)

## Type declaration

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

> **orderBy**: `any` = `null`

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

> **volunteers**: [`InterfaceEventVolunteerInfo`](types\Volunteer\interface\README\interfaces\InterfaceEventVolunteerInfo.md)[]
