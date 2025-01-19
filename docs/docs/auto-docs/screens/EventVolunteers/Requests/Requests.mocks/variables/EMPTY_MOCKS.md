[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/EventVolunteers/Requests/Requests.mocks.ts:148](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/screens/EventVolunteers/Requests/Requests.mocks.ts#L148)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_VOLUNTEER_MEMBERSHIP`

#### request.variables

> **variables**: `object`

#### request.variables.where

> **where**: `object`

#### request.variables.where.eventId

> **eventId**: `string` = `'eventId'`

#### request.variables.where.status

> **status**: `string` = `'requested'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getVolunteerMembership

> **getVolunteerMembership**: `any`[] = `[]`
