[Admin Docs](/)

***

# Variable: MOCKS\_EMPTY

> `const` **MOCKS\_EMPTY**: `object`[]

Defined in: [src/screens/EventVolunteers/VolunteerGroups/modal/VolunteerGroups.mocks.ts:339](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/VolunteerGroups/modal/VolunteerGroups.mocks.ts#L339)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_VOLUNTEER_GROUP_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.orderBy

> **orderBy**: `any` = `null`

#### request.variables.where

> **where**: `object`

#### request.variables.where.eventId

> **eventId**: `string` = `'eventId'`

#### request.variables.where.leaderName

> **leaderName**: `any` = `null`

#### request.variables.where.name\_contains

> **name\_contains**: `string` = `''`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getEventVolunteerGroups

> **getEventVolunteerGroups**: `any`[] = `[]`
