[Admin Docs](/)

***

# Variable: MOCKS\_EMPTY

> `const` **MOCKS\_EMPTY**: `object`[]

Defined in: [src/screens/EventVolunteers/Volunteers/Volunteers.mocks.ts:288](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/EventVolunteers/Volunteers/Volunteers.mocks.ts#L288)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_VOLUNTEER_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.orderBy

> **orderBy**: `any` = `null`

#### request.variables.where

> **where**: `object`

#### request.variables.where.eventId

> **eventId**: `string` = `'eventId'`

#### request.variables.where.name\_contains

> **name\_contains**: `string` = `''`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getEventVolunteers

> **getEventVolunteers**: `any`[] = `[]`
